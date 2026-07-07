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
import Footer from "./components/Footer";
import Contact from "./components/Contact";

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
      <About />
      <Menu />
      <WhyChoose />
      <Gallery />
      <Review />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}