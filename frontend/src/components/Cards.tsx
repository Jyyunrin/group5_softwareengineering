/**
 * A card component with image, description for the landing page(homepage) 
 * 
 * TODO:
 * Make it center aligned (or make the row 2 center aligned instead of this card components, for the landing page)
 */
import React from "react";

type CardProps = {
  image?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function Card({ image, title, description, children }: CardProps) {
  return (
    <div className="rounded-2xl shadow-md bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      {/* Body */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
