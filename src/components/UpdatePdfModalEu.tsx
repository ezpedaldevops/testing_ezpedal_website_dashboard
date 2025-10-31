"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, X } from "lucide-react"

interface SEOData {
  title: string
  description: string
  author: string
  subject: string
  creator: string
  keywords: string
  slug: string
  canonical_url: string
}

interface UpdatePdfModalProps {
  isOpen: boolean
  onClose: () => void
  currentLink: string
  onUpdate: (newLink: string, newTitle: string, seoData?: SEOData) => Promise<void>
  pdfId: string
  title: string
}

export default function UpdatePdfModal({ isOpen, onClose, currentLink, onUpdate, pdfId, title }: UpdatePdfModalProps) {
  const [newTitle, setNewTitle] = useState(title)
  const [, setNewFile] = useState<File | null>(null)
  const [, setNewCoverImage] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // SEO Fields State
  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    author: "",
    subject: "",
    creator: "",
    keywords: "",
    slug: "",
    canonical_url: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setNewTitle(title)
      setNewFile(null)
      setNewCoverImage(null)
      // Reset SEO data when modal opens
      setSeoData({
        title: "",
        description: "",
        author: "",
        subject: "",
        creator: "",
        keywords: "",
        slug: "",
        canonical_url: "",
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (coverInputRef.current) coverInputRef.current.value = ""
    }
  }, [isOpen, title])

  const handleUpdate = async () => {
    if (!newTitle.trim()) {
      alert("Please provide a title")
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(currentLink, newTitle, seoData)
    } catch (error) {
      console.error("Update failed:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    if (!isUpdating) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Update PDF</h2>
          <button onClick={handleClose} className="text-2xl hover:text-gray-600" disabled={isUpdating}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="flex flex-col space-y-2">
              <label className="font-medium">PDF ID</label>
              <input className="border rounded px-3 py-2 bg-gray-100" value={pdfId} disabled />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium">Title *</label>
              <input
                className="border rounded px-3 py-2"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium">New PDF File (Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                className="border rounded px-3 py-2"
              />
              <small className="text-gray-600">Leave empty to keep current file</small>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="font-medium">New Cover Image (Optional)</label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setNewCoverImage(e.target.files?.[0] || null)}
                className="border rounded px-3 py-2"
              />
              <small className="text-gray-600">Leave empty to keep current cover</small>
            </div>
          </div>

          {/* SEO Information */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-medium">SEO Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">SEO Title</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.title}
                  onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                  placeholder="Enter SEO title"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Author</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.author}
                  onChange={(e) => setSeoData({ ...seoData, author: e.target.value })}
                  placeholder="Enter author name"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Subject</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.subject}
                  onChange={(e) => setSeoData({ ...seoData, subject: e.target.value })}
                  placeholder="Enter subject"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Creator</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.creator}
                  onChange={(e) => setSeoData({ ...seoData, creator: e.target.value })}
                  placeholder="Enter creator"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Keywords</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                  placeholder="Enter keywords (comma separated)"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium">Slug</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.slug}
                  onChange={(e) => setSeoData({ ...seoData, slug: e.target.value })}
                  placeholder="Enter URL slug"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="font-medium">Description</label>
                <textarea
                  className="border rounded px-3 py-2 h-20"
                  value={seoData.description}
                  onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                  placeholder="Enter SEO description"
                />
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2">
                <label className="font-medium">Canonical URL</label>
                <input
                  className="border rounded px-3 py-2"
                  value={seoData.canonical_url}
                  onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                  placeholder="Enter canonical URL"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-4">
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleClose} disabled={isUpdating}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center"
            onClick={handleUpdate}
            disabled={!newTitle.trim() || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update PDF"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
