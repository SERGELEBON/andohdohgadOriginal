import { useState, useEffect } from "react";
import { Save, Eye, Image as ImageIcon, Type, Settings } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { supabase } from "@/lib/supabase/supabaseClient";

interface CMSSection {
  id: string;
  section_key: string;
  content: Record<string, any>;
  images?: Record<string, string>;
  active: boolean;
}

const sectionLabels: Record<string, string> = {
  hero: "Hero Section (Accueil)",
  stats: "Statistiques",
  value_proposition: "Proposition de valeur",
  services_grid: "Grille de services",
  testimonials: "Témoignages",
  blog_preview: "Aperçu blog",
  cta_banner: "Bannière CTA",
};

export default function CMSEditor() {
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [editData, setEditData] = useState<any>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    const section = sections.find(s => s.section_key === activeSection);
    if (section) {
      setEditData(section.content);
      setImages(section.images || {});
    }
  }, [activeSection, sections]);

  const fetchSections = async () => {
    const { data } = await supabase
      .from("cms_content")
      .select("*")
      .order("section_key");
    
    if (data) setSections(data);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("cms_content")
        .update({
          content: editData,
          images: images,
        })
        .eq("section_key", activeSection);

      if (error) throw error;

      setMessage("✅ Sauvegardé avec succès !");
      fetchSections();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage("❌ Erreur : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split(".");
    const newData = { ...editData };
    let current: any = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setEditData(newData);
  };

  const renderField = (key: string, value: any, path = "") => {
    const fullPath = path ? `${path}.${key}` : key;

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      return (
        <div key={fullPath} className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">{key}</p>
          {Object.entries(value).map(([k, v]) => renderField(k, v, fullPath))}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={fullPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{key}</label>
          <div className="space-y-2">
            {value.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded border">
                {typeof item === "object" ? (
                  Object.entries(item).map(([k, v]) => (
                    <div key={k} className="mb-2">
                      <label className="text-xs text-gray-500">{k}</label>
                      <input
                        type="text"
                        value={String(v)}
                        onChange={(e) => {
                          const newArray = [...value];
                          newArray[idx] = { ...newArray[idx], [k]: e.target.value };
                          updateField(key, newArray);
                        }}
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  ))
                ) : (
                  <input
                    type="text"
                    value={String(item)}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[idx] = e.target.value;
                      updateField(key, newArray);
                    }}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (typeof value === "string" && value.length > 50) {
      return (
        <div key={fullPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
          <textarea
            value={value}
            onChange={(e) => updateField(fullPath, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      );
    }

    return (
      <div key={fullPath} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
        <input
          type="text"
          value={String(value)}
          onChange={(e) => updateField(fullPath, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Éditeur de Contenu</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez le contenu dynamique du site</p>
        </div>
        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <Eye className="w-4 h-4" />
          Prévisualiser
        </a>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.startsWith("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Liste sections */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Sections
            </h3>
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.section_key}
                  onClick={() => setActiveSection(section.section_key)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeSection === section.section_key
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {sectionLabels[section.section_key] || section.section_key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Type className="w-5 h-5" />
                {sectionLabels[activeSection] || activeSection}
              </h2>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>

            {/* Textes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Textes
              </h3>
              {Object.entries(editData).map(([key, value]) => renderField(key, value))}
            </div>

            {/* Images */}
            {Object.keys(images).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images
                </h3>
                {Object.entries(images).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setImages({ ...images, [key]: e.target.value })}
                      placeholder="/images/example.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {value && (
                      <img
                        src={value}
                        alt={key}
                        className="mt-2 h-32 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
