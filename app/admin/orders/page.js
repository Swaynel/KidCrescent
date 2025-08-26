import AdminLayout from '../../../components/admin/AdminLayout';
import OrdersManager from '../../../components/admin/OrdersManager';

export default function OrdersAdmin() {
  return (
    <AdminLayout>
      <OrdersManager />
    </AdminLayout>
  );
}