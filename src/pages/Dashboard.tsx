import Layout from "../components/Layout";
import DashboardContent from "../components/DashboardContent";


function Dashboard() {
  const role = "SUPER_ADMIN"; 
  return (
    <Layout role={role}>
      <DashboardContent />
    </Layout>
  );
}

export default Dashboard;
