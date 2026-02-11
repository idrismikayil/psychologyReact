// ./Chart.tsx
import { Bar } from "@ant-design/plots";

// scores və scaleData tiplərini 'any' kimi qəbul edirik
const SidebarChart = ({ scores, scaleData }: any) => {
  const data = scaleData.map((scale: any) => ({
    label: scale.label,
    value: scores[scale.key] ?? 0,
  }));

  const config: any = {
    data,
    xField: "label",
    yField: "value",

    // Hər bir bar üçün fərqli rəng
    colorField: "label",

    legend: false,
    barStyle: { radius: [4, 4, 0, 0] },

    // Bar hündürlüyü / qalınlığı
    style: {
      maxWidth: 35,
    },
  };

  return <Bar {...config} />;
};

export default SidebarChart;
