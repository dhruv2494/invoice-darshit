import DashboardLayout from "../components/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      <p className="text-gray-700">Choose an option from the sidebar.</p>
    </DashboardLayout>
  );
};

export default Dashboard;
