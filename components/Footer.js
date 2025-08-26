import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  return (
    <footer className="bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <NewsletterSignup />
        <p className="text-center mt-8 text-gray-400">© 2025 Kid Crescent. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;