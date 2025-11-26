"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SeoPage() {
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: "",
    openGraph: {
      title: "",
      description: "",
      url: "",
      siteName: "",
      locale: "en_US",
      type: "website",
    },
  });

  useEffect(() => {
    axios.get("/api/seo/get").then((res) => {
      const data = res.data;
      setSeo({
        ...data,
        keywords: data.keywords.join(", "),
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...seo,
      keywords: seo.keywords.split(",").map((k) => k.trim()),
    };

    await axios.put("/api/seo/update", payload);
    alert("SEO Updated Successfully");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Website SEO</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="font-medium">Title</label>
          <input
            type="text"
            className="block w-full border p-2 rounded"
            value={seo.title}
            onChange={(e) => setSeo({ ...seo, title: e.target.value })}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium">Description</label>
          <textarea
            className="block w-full border p-2 rounded"
            rows={3}
            value={seo.description}
            onChange={(e) => setSeo({ ...seo, description: e.target.value })}
          />
        </div>

        {/* KEYWORDS */}
        <div>
          <label className="font-medium">Keywords (comma separated)</label>
          <input
            type="text"
            className="block w-full border p-2 rounded"
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
          />
        </div>

        {/* OPEN GRAPH FIELDS */}
        <div>
          <h2 className="font-semibold mt-6 mb-2">Open Graph Settings</h2>
        </div>

        <input
          className="block w-full border p-2 rounded"
          placeholder="OG Title"
          value={seo.openGraph.title}
          onChange={(e) =>
            setSeo({
              ...seo,
              openGraph: { ...seo.openGraph, title: e.target.value },
            })
          }
        />

        <textarea
          className="block w-full border p-2 rounded"
          rows={2}
          placeholder="OG Description"
          value={seo.openGraph.description}
          onChange={(e) =>
            setSeo({
              ...seo,
              openGraph: { ...seo.openGraph, description: e.target.value },
            })
          }
        />

        <input
          className="block w-full border p-2 rounded"
          placeholder="OG URL"
          value={seo.openGraph.url}
          onChange={(e) =>
            setSeo({
              ...seo,
              openGraph: { ...seo.openGraph, url: e.target.value },
            })
          }
        />

        <input
          className="block w-full border p-2 rounded"
          placeholder="Site Name"
          value={seo.openGraph.siteName}
          onChange={(e) =>
            setSeo({
              ...seo,
              openGraph: { ...seo.openGraph, siteName: e.target.value },
            })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
          Save SEO Settings
        </button>
      </form>
    </div>
  );
}
