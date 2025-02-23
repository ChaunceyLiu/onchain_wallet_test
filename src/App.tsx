// App.tsx 主入口
import { useState, useEffect } from "react";
import BalanceCard from "@/components/BalanceCard";
import AdaptiveLayout from "@/components/AdaptiveLayout";
import Navbar from "@/components/Navbar";
import Account from "@/components/Account";
import Bottom from "@/components/Bottom";
import { StateProvider } from "@/hooks/useGlobalState";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <StateProvider>
      <AdaptiveLayout>
        <Navbar />
        <Account />
        <BalanceCard />
        <Bottom />
      </AdaptiveLayout>
    </StateProvider>
  );
};

export default App;
