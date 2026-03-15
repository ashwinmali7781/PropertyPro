import { useState, useRef } from 'react'
import { FiX, FiImage } from 'react-icons/fi'

export default function ImageUpload({ images = [], onChange, existingImages = [], onDeleteExisting }) {
  const inputRef = useRef()
  const [previews, setPreviews] = useState([])

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))
    setPreviews((prev) => [...prev, ...newPreviews])
    onChange([...images, ...files])
  }

  const removeNew = (idx) => {
    const updated = previews.filter((_, i) => i !== idx)
    setPreviews(updated)
    onChange(updated.map((p) => p.file))
  }

  return (
    <div className="space-y-4">
      {/* Existing images */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Existing images (click × to remove)</p>
          <div className="grid grid-cols-4 gap-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden h-24">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => onDeleteExisting(img.filename)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((p, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden h-24">
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeNew(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <div onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
        <FiImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB each (max 10)</p>
        <input ref={inputRef} type="file" multiple accept="image/*"
          className="hidden" onChange={handleFiles} />
      </div>
    </div>
  )
}
