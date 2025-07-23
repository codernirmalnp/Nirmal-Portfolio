'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { HexColorPicker } from 'react-colorful';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validation?: any;
}

interface TextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

interface RichTextEditorProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface ColorPickerFieldProps {
  name: string;
  label: string;
  required?: boolean;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  validation
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-outfit font-medium text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            id={name}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md shadow-sm bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-transparent focus:border-white/50 transition-all duration-200 ${
              error ? 'border-red-500' : 'border-white/20'
            }`}
          />
        )}
      />
      {error && (
        <p className="text-sm text-red-400 font-opensans">{error.message as string}</p>
      )}
    </div>
  );
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  label,
  placeholder,
  rows = 3,
  required = false
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-outfit font-medium text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            rows={rows}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md shadow-sm bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-transparent focus:border-white/50 transition-all duration-200 ${
              error ? 'border-red-500' : 'border-white/20'
            }`}
          />
        )}
      />
      {error && (
        <p className="text-sm text-red-400 font-opensans">{error.message as string}</p>
      )}
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  label,
  placeholder,
  required = false
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const [isClient, setIsClient] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-outfit font-medium text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const editor = useEditor({
            extensions: [
              StarterKit.configure({
                bulletList: {
                  HTMLAttributes: {
                    class: 'list-disc',
                  },
                },
                orderedList: {
                  HTMLAttributes: {
                    class: 'list-decimal',
                  },
                },
                listItem: {
                  HTMLAttributes: {
                    class: 'list-item',
                  },
                },
              }),
              CodeBlock,
              Image.configure({
                HTMLAttributes: {
                  class: 'max-w-full h-auto rounded-lg border border-white/20',
                },
              }),
              Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                  class: 'text-blue-400 underline',
                },
              }),
              Placeholder.configure({
                placeholder: placeholder || 'Start writing your content...',
                emptyEditorClass: 'is-editor-empty',
              }),
            ],
            content: field.value,
            onUpdate: ({ editor }) => {
              field.onChange(editor.getHTML());
            },
            editorProps: {
              attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
              },
            },
            immediatelyRender: false,
          });

          const addImage = () => {
            if (imageUrl) {
              editor?.chain().focus().setImage({ src: imageUrl }).run();
              setImageUrl('');
              setShowImageModal(false);
            }
          };

          const addLink = () => {
            if (linkUrl) {
              editor?.chain().focus().setLink({ href: linkUrl }).run();
              setLinkUrl('');
              setShowLinkModal(false);
            }
          };

          const handleFileUpload = async (file: File) => {
            if (file && file.type.startsWith('image/')) {
              try {
                // Upload to S3
                const formData = new FormData();
                formData.append('file', file);
                const uploadRes = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });
                if (!uploadRes.ok) {
                  alert('Failed to upload image');
                  return;
                }
                const { url } = await uploadRes.json();
                editor?.chain().focus().setImage({ src: url }).run();
              } catch (error) {
                alert('Failed to upload image');
              }
            }
          };

          const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
            // Reset the input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };

          const handleDrop = (event: React.DragEvent) => {
            event.preventDefault();
            setIsDragOver(false);
            
            const files = event.dataTransfer.files;
            if (files.length > 0) {
              handleFileUpload(files[0]);
            }
          };

          const handleDragOver = (event: React.DragEvent) => {
            event.preventDefault();
            setIsDragOver(true);
          };

          const handleDragLeave = (event: React.DragEvent) => {
            event.preventDefault();
            setIsDragOver(false);
          };

          if (!isClient) {
            return (
              <div className={`border rounded-md overflow-hidden ${
                error ? 'border-red-500' : 'border-white/20'
              }`}>
                <div className="bg-black/30 border-b border-white/20 p-2 flex flex-wrap gap-2">
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-type-bold"></i>
                  </div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-type-italic"></i>
                  </div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-type-underline"></i>
                  </div>
                  <div className="w-px bg-white/20 mx-2"></div>
                  <div className="p-2 rounded text-white/70">H1</div>
                  <div className="p-2 rounded text-white/70">H2</div>
                  <div className="p-2 rounded text-white/70">H3</div>
                  <div className="w-px bg-white/20 mx-2"></div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-list-ul"></i>
                  </div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-list-ol"></i>
                  </div>
                  <div className="w-px bg-white/20 mx-2"></div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-code-slash"></i>
                  </div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-image"></i>
                  </div>
                  <div className="p-2 rounded text-white/70">
                    <i className="bi bi-link-45deg"></i>
                  </div>
                </div>
                <div className="bg-black/50 min-h-[200px] p-4 text-white/50">
                  {placeholder || 'Start typing...'}
                </div>
              </div>
            );
          }

          return (
            <div className={`border rounded-md overflow-hidden ${
              error ? 'border-red-500' : 'border-white/20'
            }`}>
              {/* Toolbar */}
              <div className="bg-black/30 border-b border-white/20 p-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('bold') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Bold"
                >
                  <i className="bi bi-type-bold"></i>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('italic') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Italic"
                >
                  <i className="bi bi-type-italic"></i>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('underline') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Underline"
                >
                  <i className="bi bi-type-underline"></i>
                </button>
                <div className="w-px bg-white/20 mx-2"></div>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('heading', { level: 1 }) ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('heading', { level: 2 }) ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('heading', { level: 3 }) ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Heading 3"
                >
                  H3
                </button>
                <div className="w-px bg-white/20 mx-2"></div>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('bulletList') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Bullet List"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('orderedList') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Numbered List"
                >
                  <i className="bi bi-list-ol"></i>
                </button>
                <div className="w-px bg-white/20 mx-2"></div>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('codeBlock') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Code Block"
                >
                  <i className="bi bi-code-slash"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="p-2 rounded hover:bg-white/10 transition-colors text-white/70"
                  title="Add Image by URL"
                >
                  <i className="bi bi-image"></i>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded hover:bg-white/10 transition-colors text-white/70"
                  title="Upload Image"
                >
                  <i className="bi bi-upload"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(true)}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('link') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Add Link"
                >
                  <i className="bi bi-link-45deg"></i>
                </button>
                <div className="w-px bg-white/20 mx-2"></div>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  className={`p-2 rounded hover:bg-white/10 transition-colors ${
                    editor?.isActive('paragraph') ? 'bg-white/20 text-white' : 'text-white/70'
                  }`}
                  title="Paragraph"
                >
                  P
                </button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {/* Editor Content */}
              <div 
                className={`bg-black/50 min-h-[200px] relative ${
                  isDragOver ? 'bg-white/5 border-2 border-dashed border-white/30' : ''
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {isDragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="text-center">
                      <i className="bi bi-cloud-upload text-4xl text-white/70 mb-2"></i>
                      <p className="text-white/70 font-outfit">Drop image here to upload</p>
                    </div>
                  </div>
                )}
                <EditorContent 
                  editor={editor} 
                  className="prose prose-invert max-w-none focus:outline-none"
                />
              </div>

              {/* Image Modal */}
              {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-darkBg p-6 rounded-lg border border-white/20 w-full max-w-md">
                    <h3 className="text-lg font-outfit font-medium text-white mb-4">Add Image by URL</h3>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-transparent focus:border-white/50 transition-all duration-200 mb-4"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={addImage}
                        className="bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
                      >
                        Add Image
                      </button>
                      <button
                        onClick={() => {
                          setShowImageModal(false);
                          setImageUrl('');
                        }}
                        className="bg-darkBg hover:bg-black/50 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Link Modal */}
              {showLinkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-darkBg p-6 rounded-lg border border-white/20 w-full max-w-md">
                    <h3 className="text-lg font-outfit font-medium text-white mb-4">Add Link</h3>
                    <input
                      type="url"
                      placeholder="Enter URL"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-white/20 rounded-md bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-transparent focus:border-white/50 transition-all duration-200 mb-4"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={addLink}
                        className="bg-themeGradient hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium transition-all duration-200"
                      >
                        Add Link
                      </button>
                      <button
                        onClick={() => {
                          setShowLinkModal(false);
                          setLinkUrl('');
                        }}
                        className="bg-darkBg hover:bg-black/50 text-white px-4 py-2 rounded-md text-sm font-outfit font-medium border border-white/20 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
      {error && (
        <p className="text-sm text-red-400 font-opensans">{error.message as string}</p>
      )}
    </div>
  );
};

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  name,
  label,
  required = false
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-outfit font-medium text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-md border-2 border-white/20"
                style={{ backgroundColor: field.value }}
              />
              <input
                {...field}
                type="text"
                className="flex-1 px-3 py-2 border border-white/20 rounded-md bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-transparent focus:border-white/50 transition-all duration-200"
                placeholder="#000000"
              />
            </div>
            <div className="border border-white/20 rounded-md p-3 bg-black/30">
              <HexColorPicker
                color={field.value}
                onChange={field.onChange}
                className="w-full"
              />
            </div>
          </div>
        )}
      />
      {error && (
        <p className="text-sm text-red-400 font-opensans">{error.message as string}</p>
      )}
    </div>
  );
};

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  required = false
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-outfit font-medium text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedOption = options.find(option => option.value === field.value);
          
          return (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-transparent focus:border-white/50 transition-all duration-200 flex items-center justify-between ${
                  error ? 'border-red-500' : 'border-white/20'
                } ${isOpen ? 'border-white/50' : ''}`}
              >
                <span className={selectedOption ? 'text-white' : 'text-white/50'}>
                  {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
                </span>
                <i className={`bi bi-chevron-down transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}></i>
              </button>
              
              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-black/90 border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        field.onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                        field.value === option.value 
                          ? 'bg-themeGradient text-white' 
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Hidden select for form submission */}
              <select
                {...field}
                className="sr-only"
              >
                {placeholder && (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                )}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }}
      />
      {error && (
        <p className="text-sm text-red-400 font-opensans">{error.message as string}</p>
      )}
    </div>
  );
}; 

// Restore FeatureImageFieldProps and FeatureImageField for use in blog image upload
interface FeatureImageFieldProps {
  name: string;
  label: string;
  required?: boolean;
  width?: number;
  height?: number;
}

export const FeatureImageField: React.FC<FeatureImageFieldProps> = ({
  name,
  label,
  required = false,
  width = 630,
  height = 393
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          // Upload to S3
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          if (!uploadRes.ok) {
            setPreviewUrl('');
            onChange('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            alert('Failed to upload image');
            return;
          }
          const { url } = await uploadRes.json();
          setPreviewUrl(url);
          onChange(url);
        } catch (error) {
          setPreviewUrl('');
          onChange('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          alert('Failed to upload image');
        }
      }
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (event: React.DragEvent, onChange: (value: string) => void) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        try {
          // Upload to S3
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          if (!uploadRes.ok) {
            setPreviewUrl('');
            onChange('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            alert('Failed to upload image');
            return;
          }
          const { url } = await uploadRes.json();
          setPreviewUrl(url);
          onChange(url);
        } catch (error) {
          setPreviewUrl('');
          onChange('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          alert('Failed to upload image');
        }
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeImage = async (onChange: (value: string) => void, valueToDelete?: string) => {
    const urlToDelete = valueToDelete || previewUrl || fieldValue();
    if (urlToDelete) {
      try {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToDelete }),
        });
      } catch (e) {
        // Optionally handle error (e.g., show a toast)
      }
    }
    setPreviewUrl('');
    onChange('');
  };

  // Helper to get the current field value (for delete on change)
  const fieldValue = () => {
    return fileInputRef.current?.dataset.value || '';
  };

  // Wrap file input onChange to delete previous image before uploading new one
  const handleFileInputChangeWithDelete = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void, value: string) => {
    if (value) {
      await removeImage(onChange, value);
    }
    await handleFileChange(event, onChange);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-outfit font-medium text-white/70">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              data-value={field.value || ''}
              onChange={(e) => handleFileInputChangeWithDelete(e, field.onChange, field.value || '')}
              className="hidden"
            />
            {/* Upload Area */}
            {!field.value && !previewUrl && (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                  error ? 'border-red-500 bg-red-500/10' : 'border-white/20 hover:border-white/40 bg-black/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => handleDrop(e, field.onChange)}
                onDragOver={handleDragOver}
              >
                <i className="bi bi-cloud-upload text-3xl text-white/50 mb-3"></i>
                <p className="text-white/70 font-outfit mb-2">Click to upload or drag and drop</p>
                <p className="text-white/50 text-sm font-opensans">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            {/* Preview Area */}
            {(field.value || previewUrl) && (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={field.value || previewUrl}
                    alt="Image preview"
                    className="w-full h-auto rounded-lg border border-white/20"
                    style={{
                      maxWidth: `${width}px`,
                      maxHeight: `${height}px`,
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(field.onChange)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    title="Remove image"
                  >
                    <i className="bi bi-x text-sm"></i>
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (field.value) {
                        await removeImage(field.onChange, field.value);
                      }
                      fileInputRef.current?.click();
                    }}
                    className="btn-secondary text-sm"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      />
      {error && (
        <p className="text-sm text-red-400 font-opensans">{error.message as string}</p>
      )}
    </div>
  );
}; 