"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useApiToken } from "@/hooks/useApiToken";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import {
  FiBook,
  FiUser,
  FiMail,
  FiUploadCloud,
  FiImage,
  FiLayers,
  FiHash,
  FiFileText,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export function AddBookForm() {
  const { user } = useAuth();
  const fetchToken = useApiToken();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format", {
        description: "Please select an image file (PNG, JPG, JPEG, or WEBP).",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large", {
        description: "Please choose an image smaller than 10MB.",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("Fiction");
    setDescription("");
    setQuantity("1");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Missing Title", {
        description: "Please enter the title of the book.",
      });
      return;
    }

    if (!author.trim()) {
      toast.error("Missing Author", {
        description: "Please provide the author or creator name.",
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Missing Description", {
        description: "Please write a short description or overview for readers.",
      });
      return;
    }

    const copiesCount = Number(quantity);
    if (isNaN(copiesCount) || copiesCount < 1) {
      toast.error("Invalid Copies Count", {
        description: "Total copies must be at least 1.",
      });
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error("Cover Image Required", {
        description: "Please upload a book cover image for the library catalog.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imagePreview || "";
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

      if (imageFile && imgbbKey) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imgbbData = await imgbbRes.json();
        if (imgbbData?.data?.url) {
          finalImageUrl = imgbbData.data.url;
        } else {
          throw new Error(
            imgbbData?.error?.message || "Failed to upload cover image to ImgBB."
          );
        }
      }

      const token = await fetchToken();

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const baseUrl = rawApiUrl.replace(/\/+$/, "");
      const targetUrl = baseUrl.endsWith("/api")
        ? `${baseUrl}/books`
        : `${baseUrl}/api/books`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const bookPayload = {
        title: title.trim(),
        author: author.trim(),
        category,
        image: finalImageUrl,
        description: description.trim(),
        quantity: copiesCount,
        userName: user?.name || "Anonymous Reader",
        userEmail: user?.email || "",
      };

      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(bookPayload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(
          errJson?.message || `Server returned error status: ${res.status}`
        );
      }

      toast.success("Book Cataloged Successfully!", {
        description: `"${title.trim()}" has been added to the BookNook sanctuary shelves.`,
      });

      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while adding the book.";
      toast.error("Could Not Add Book", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-10 shadow-xl backdrop-blur-sm">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-4 shadow-xs">
            <FiBook />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow="Curator Shelf Contribution"
            subtitle="Share a beloved edition with our community. Provide accurate details to help readers discover its pages."
          >
            Add a New Book
          </Heading>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="book-title"
                className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5"
              >
                <FiBook className="w-3.5 h-3.5 text-primary" />
                <span>Book Title</span>
              </label>
              <input
                id="book-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Shadow of the Wind"
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="book-author"
                className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5"
              >
                <FiUser className="w-3.5 h-3.5 text-primary" />
                <span>Author Name</span>
              </label>
              <input
                id="book-author"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Carlos Ruiz Zafón"
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="book-category"
                className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5"
              >
                <FiLayers className="w-3.5 h-3.5 text-secondary" />
                <span>Category</span>
              </label>
              <select
                id="book-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="book-quantity"
                className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5"
              >
                <FiHash className="w-3.5 h-3.5 text-secondary" />
                <span>Total Copies</span>
              </label>
              <input
                id="book-quantity"
                type="number"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="book-image"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5"
            >
              <FiImage className="w-3.5 h-3.5 text-accent" />
              <span>Book Cover Image</span>
            </label>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-base-300 hover:border-primary rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors duration-200 bg-base-200/40 hover:bg-base-200/70 flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <FiUploadCloud />
                </div>
                <div className="text-sm font-semibold text-base-content font-sans">
                  Click to select cover image
                </div>
                <div className="text-xs text-base-content/60 font-sans">
                  Supports PNG, JPG, JPEG, and WEBP up to 10MB
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-22 rounded-xl overflow-hidden bg-base-300 shrink-0 border border-base-300 shadow-sm relative aspect-[3/4]">
                    <img
                      src={imagePreview}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-base-content block line-clamp-1 font-sans">
                      {imageFile?.name || "Selected Cover Image"}
                    </span>
                    <span className="text-xs text-success font-medium flex items-center gap-1 mt-0.5">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      Image preview loaded
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl"
                  aria-label="Remove image"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="book-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="book-description"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans flex items-center gap-1.5"
            >
              <FiFileText className="w-3.5 h-3.5 text-primary" />
              <span>Short Description</span>
            </label>
            <textarea
              id="book-description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief overview of the plot, themes, or historical context to help fellow readers..."
              className="textarea textarea-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl p-3 leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-base-content/70 font-sans">
              Contributor Credentials (Active Session)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-base-100 border border-base-300/80 text-xs text-base-content/80 font-sans">
                <FiUser className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{user?.name || "Curator Reader"}</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-base-100 border border-base-300/80 text-xs text-base-content/80 font-sans">
                <FiMail className="w-4 h-4 text-secondary shrink-0" />
                <span className="truncate">{user?.email || "reader@booknook.library"}</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full justify-center h-12 shadow-md text-base"
          >
            Catalog and Place on Shelf
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default AddBookForm;

