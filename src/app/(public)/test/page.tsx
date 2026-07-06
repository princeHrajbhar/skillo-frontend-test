"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface ContentSection {
  htmlContent: string;
}

export default function BlogCreatePage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const [banner, setBanner] = useState<File | null>(null);
  const [brochurePdf, setBrochurePdf] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    blogCategory: "",
    postedBy: "",
    status: "draft",
    postingDate: new Date().toISOString().slice(0, 16),
    keywords: "",
    urls: "",
  });

  const [contentSections, setContentSections] = useState<
    ContentSection[]
  >([{ htmlContent: "" }]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "",
      answer: "",
    },
  ]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        slug: formData.slug,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,

        keywords: formData.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        urls: formData.urls
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        contentSections,

        faqs,

        blogCategory: formData.blogCategory,
        postedBy: formData.postedBy,

        postingDate: formData.postingDate,

        status: formData.status,
      };

      const submitData = new FormData();

      submitData.append(
        "data",
        JSON.stringify(payload)
      );

      if (banner) {
        submitData.append("banner", banner);
      }

      if (brochurePdf) {
        submitData.append(
          "brochurePdf",
          brochurePdf
        );
      }

      const res = await fetch(
        "http://localhost:5000/api/v1/blogs",
        {
          method: "POST",
          body: submitData,
        }
      );

      const result = await res.json();

      setResponse(result);
    } catch (error) {
      console.error(error);
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Create Blog
          </h1>

          <p className="mt-2 text-zinc-400">
            Test your blog API from frontend.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <input
                placeholder="Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value,
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <input
                placeholder="Blog Category Id"
                value={formData.blogCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    blogCategory: e.target.value,
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <input
                placeholder="Posted By User Id"
                value={formData.postedBy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postedBy: e.target.value,
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <input
                type="datetime-local"
                value={formData.postingDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postingDate: e.target.value,
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              >
                <option value="draft">
                  Draft
                </option>
                <option value="published">
                  Published
                </option>
              </select>
            </div>
          </div>

          {/* SEO */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">
              SEO Information
            </h2>

            <div className="space-y-4">
              <input
                placeholder="SEO Title"
                value={formData.seoTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoTitle: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <textarea
                placeholder="SEO Description"
                rows={4}
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoDescription:
                      e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <input
                placeholder="Keywords (comma separated)"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    keywords: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />

              <input
                placeholder="URLs (comma separated)"
                value={formData.urls}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    urls: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
              />
            </div>
          </div>

          {/* Uploads */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Upload Files
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Banner Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBanner(
                      e.target.files?.[0] || null
                    )
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Brochure PDF
                </label>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setBrochurePdf(
                      e.target.files?.[0] || null
                    )
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Content Sections */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Sections
              </h2>

              <button
                type="button"
                onClick={() =>
                  setContentSections([
                    ...contentSections,
                    {
                      htmlContent: "",
                    },
                  ])
                }
                className="rounded-lg bg-cyan-500 px-4 py-2 text-black"
              >
                Add Section
              </button>
            </div>

            <div className="space-y-4">
              {contentSections.map(
                (section, index) => (
                  <textarea
                    key={index}
                    rows={6}
                    placeholder="HTML Content"
                    value={
                      section.htmlContent
                    }
                    onChange={(e) => {
                      const updated = [
                        ...contentSections,
                      ];

                      updated[
                        index
                      ].htmlContent =
                        e.target.value;

                      setContentSections(
                        updated
                      );
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
                  />
                )
              )}
            </div>
          </div>

          {/* FAQs */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                FAQs
              </h2>

              <button
                type="button"
                onClick={() =>
                  setFaqs([
                    ...faqs,
                    {
                      question: "",
                      answer: "",
                    },
                  ])
                }
                className="rounded-lg bg-cyan-500 px-4 py-2 text-black"
              >
                Add FAQ
              </button>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-xl border border-zinc-800 p-4"
                >
                  <input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [
                        ...faqs,
                      ];

                      updated[
                        index
                      ].question =
                        e.target.value;

                      setFaqs(updated);
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
                  />

                  <textarea
                    rows={3}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [
                        ...faqs,
                      ];

                      updated[index].answer =
                        e.target.value;

                      setFaqs(updated);
                    }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400"
          >
            {loading
              ? "Creating Blog..."
              : "Create Blog"}
          </button>
        </form>

        {response && (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              API Response
            </h2>

            <pre className="overflow-auto text-sm text-green-400">
              {JSON.stringify(
                response,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}