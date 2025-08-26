import './globals.css';
import { AuthProvider } from '../lib/auth';
import { CartProvider } from '../components/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Kid Crescent Music Platform',
  description: 'Official website for Kid Crescent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}