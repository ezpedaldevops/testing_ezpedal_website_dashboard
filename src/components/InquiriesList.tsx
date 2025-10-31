import React from "react";
import { AllForms } from "@/types";

interface InquiriesListProps {
  inquiries: AllForms[];
  onInquiryClick: (inquiry: AllForms) => void;
  isLoading: boolean;
  selectedForms: Set<string>;
  onSelectForm: (id: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    onPageChange: (page: number) => void;
  };
}

const InquiriesList: React.FC<InquiriesListProps> = ({
  inquiries,
  onInquiryClick,
  isLoading,
  selectedForms,
  onSelectForm,
  pagination,
}) => {
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      {/* Display current page items (already paginated from server) */}
      {inquiries.map((inquiry) => (
        <div key={inquiry._id} className="flex items-center p-4 border-b">
          <input
            type="checkbox"
            checked={selectedForms.has(inquiry._id)}
            onChange={() => onSelectForm(inquiry._id)}
            className="mr-2"
          />
          <div className="flex-grow cursor-pointer" onClick={() => onInquiryClick(inquiry)}>
            <h3 className="text-xl font-bold">{inquiry.name}</h3>
            <p>{inquiry.message}</p>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InquiriesList;
