// Frontend configuration values

// The primary contact email for the business
// This is used in forms and contact information displays
export const contactEmail = "hello@freebeer.ai";

// Default site metadata
export const siteTitle = "Free Beer Studio - AI Automation Agency";
export const siteDescription = "We help businesses automate with artificial intelligence, creating smarter workflows and better customer experiences.";

// Brand colors (these should match your Tailwind config)
export const brandColors = {
  rocketGray: "#5A6A76",
  jetBlack: "#1C1C1C", 
  launchOrange: "#D95F2C",
  vaporPurple: "#9D82C1",
  smokyLavender: "#B49CD6",
  cloudWhite: "#F1F1F1",
};

// API configuration
export const apiConfig = {
  // Base URL for the backend API (automatically handled by Encore)
  baseUrl: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000',
  
  // Request timeout in milliseconds
  timeout: 10000,
};

// Feature flags
export const features = {
  // Enable newsletter signup functionality
  newsletterEnabled: true,
  
  // Enable analytics tracking
  analyticsEnabled: true,
  
  // Enable dark mode (currently always on for brand consistency)
  darkModeEnabled: true,
  
  // Enable admin dashboard features
  adminDashboardEnabled: true,
};

// Social media links
export const socialLinks = {
  twitter: "https://twitter.com/freebeerstudio",
  linkedin: "https://linkedin.com/company/freebeerstudio", 
  github: "https://github.com/freebeerstudio",
  email: contactEmail,
};

// Business information
export const businessInfo = {
  name: "Free Beer Studio",
  tagline: "Launch Your Business Into the AI Future",
  description: "We help businesses automate with artificial intelligence, creating smarter workflows and better customer experiences.",
  timezone: "America/Chicago", // US/Central
  businessHours: "Mon-Fri 9AM-6PM CST",
};
