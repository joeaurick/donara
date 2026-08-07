import LocalBusinessSchema from "./components/seo/LocalBusinessSchema";
import ProductSchema from "./components/seo/ProductSchema";
import ReviewSchema from "./components/seo/ReviewSchema";
import OrganizationSchema from "./components/seo/OrganizationSchema";
import WebsiteSchema from "./components/seo/WebsiteSchema";
import SearchActionSchema from "./components/seo/SearchActionSchema";
import BreadcrumbSchema from "./components/seo/BreadcrumbSchema";
import FAQSchema from "./components/seo/FAQSchema";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Menu from "./components/Menu";
import WhyChoose from "./components/WhyChoose";
import Gallery from "./components/Gallery";
import Review from "./components/Review";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <ProductSchema />
      <ReviewSchema />
      <OrganizationSchema />
      <WebsiteSchema />
      <SearchActionSchema />
      <BreadcrumbSchema />
      <FAQSchema />

      <Navbar />

      <main className="pt-20">
        <Hero />
        <About />

        {/* MENU HARUS DIPANGGIL */}
        <Menu />

        <WhyChoose />
        <Gallery />
        <Review />
        <CTA />
        <Contact />
      </main>

      <Footer />
    </>
  );
}