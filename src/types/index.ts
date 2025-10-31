export interface Application {
    category: string;
    id: number;
    name: string;
    email: string;
    contact_number: string;
    resume: string;
    portfolio_link: string;
    linkedin_link: string;
    desired_position: string;
    message: string;
    created_at: string;
}


// export interface ImageData {
//     id: number;
//     "page-name": string;
//     "section-name": number;
//     "image-identifier": string;
//     link: string;
// }

export interface ImageData {
  section_name: number;
  page_name: string;
  image_identifier: string;
  section_title?: string;
  cover_page?: string;
  media: {
    url: string;
    contentType: string;
    size: number;
  };
}


// export interface ResidentialForm {
//     id: number;
//     name: string;
//     nameof_society: string;
//     contact_number: string;
//     message?: string;
// }

// export interface CorporateForm {
//     id: number;
//     name: string;
//     nameof_company: string;
//     company_email: string;
//     contact_number: string;
//     message?: string;
// }

export interface AdvertisementForm {
    id: number;
    name: string;
    nameof_company: string;
    email: string;
    company_email: string;
    contact_number: string;
    message?: string;
    advertisement_type: 'pedelecs' | 'residential' | 'ledboards';  // Use the advertisement_type enum
}

export interface CareerForm {
    id: number;
    name: string;
    email: string;
    contact_number: string;
    resume: Blob; // Store the resume as a Blob
    portfolio_link?: string;
    linkedin_link?: string;
    desired_position: string;
    message?: string;
}

// export interface AllForms {
//     category: string;
//     id: number;
//     name: string;
//     nameof_company?: string;
//     email?: string;
//     company_email?: string;
//     contact_number: string;
//     message?: string;
//     advertisement_type?: 'pedelecs' | 'residential' | 'ledboards';  // Use the advertisement_type enum
//     nameof_society?: string;
//     resume?: Blob; // Store the resume as a Blob
//     portfolio_link?: string;
//     linkedin_link?: string;
//     desired_position?: string;
//     created_at: string;
// }

//----------------------------------------------------------------------------------------------------------



export interface Resume {
  url: string;
  contentType: string;
  size: number;
}

export interface AllForms {
  _id: string;
  full_name:string
  name: string;
  email: string;
  contact_number: string;
  portfolio_link: string;
  linkedin_link: string;
  desired_position: string;
  message: string;
  resume: Resume;
  created_at: string;
  category?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  fromCache?: boolean;
}



export interface ResidentialForm {
  _id: string
  name: string
  nameof_society: string
  contact_number: string
  message: string
  created_at: string
  category: 'residential_forms'
}

export interface CorporateForm {
  _id: string
  name: string
  nameof_company: string
  company_email: string
  contact_number: string
  message: string
  created_at: string
  category: 'corporate_forms'
}




