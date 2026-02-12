import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import image from "../../shared/media/imgs/intj-male.svg";
import jsPDF from "jspdf";
import API from "../../api";
import SidebarChart from "./Chart";
import { useUser } from "@/context/UserContext";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";

const TestResult = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || null;
  const testSelected = searchParams.get("test") || null;
  const { user, refreshUser } = useUser();
  const pdfRef = useRef<HTMLDivElement>(null);

  const scaleData: any[] = [
    { label: "Ekstrovasiya", key: "E" },
    { label: "İntuisiya", key: "N" },
    { label: "Məntiq", key: "T" },
    { label: "Fərqindəlik / Hiss", key: "F" },
    { label: "Mühakimə", key: "J" },
    { label: "Planlılıq", key: "P" },
    { label: "Sensing / Hiss Etmə", key: "S" },
    { label: "İnnovativ / Nəzəri", key: "N" },
  ];

  const downloadPDF = async () => {
    if (!result) return;
if (result.file) {
  fetch(result.file)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MBTI-${userType}-result.pdf`; // Fayl adı
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // memory leak olmaması üçün
      return;
    })
    .catch(err => console.error("Download failed:", err));
}

    const createTitle = (text: string) =>
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: 28,
            color: "4B0082",
          }),
        ],
        spacing: { after: 200 },
      });

    const createText = (text: string | string[]) => {
      if (Array.isArray(text)) {
        return text.map(
          (line) =>
            new Paragraph({
              children: [new TextRun({ text: line, size: 22 })],
            })
        );
      } else {
        return [new Paragraph({ children: [new TextRun({ text, size: 22 })] })];
      }
    };

    const createList = (title: string, items: string[]) => [
      createTitle(title),
      ...items.map(
        (item) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${item}`, size: 22 })],
            spacing: { after: 100 },
          })
      ),
    ];

    const sections: Paragraph[] = [
      createTitle(`16 tip şəxsiyyət testinin nəticəsi - ${userType}`),
      ...createText([result.summary, result.workplacePersonality]),
      ...createList("Əsas motivatorlar", result.keyMotivators),
      ...createList("İdeal iş mühiti", result.idealWorkEnvironment),
      ...createList("Əsas dəyərlər", result.coreValues),
      ...createList("Sevdiyi iş tapşırıqları", result.preferredWorkTasks),
      ...createList("Təşkilata töhfələr", result.contributionsToOrganization),

      ...createText(["Komanda ilə işləmə tərzi", result.workingWithTeam]),
      ...createList("Komandaya kömək edə biləcək bacarıqlar", result.teamHelp),
      ...createList("Komandada narahatlıq yaradan hallar", result.teamIrritate),
      ...createList("Komanda bacarıqlarını inkişaf etdirmək üçün addımlar", result.teamActionSteps),

      ...createText(["Ünsiyyət", result.communicatingWithOthers]),
      ...createList("Ünsiyyətdə güclü tərəflər", result.communicationStrengths),
      ...createList("Ünsiyyət problemləri", result.communicationMisunderstanding),
      ...createList("Ünsiyyət bacarıqlarını inkişaf etdirmək üçün addımlar", result.communicationActionSteps),

      ...createText(["Münaqişələrin idarəsi", result.managingConflict]),
      ...createList("Münaqişəyə kömək", result.conflictHelp),
      ...createList("Münaqişə yaradan hallar", result.conflictTriggeredBy),
      ...createList("Münaqişədə narahat edən hallar", result.conflictIrritate),
      ...createList("Münaqişə bacarıqlarını inkişaf etdirmək üçün addımlar", result.conflictActionSteps),

      ...createText(["Liderlik", result.takingTheLead]),
      ...createList("Başqalarını ilhamlandırmaq üçün yollar", result.inspireOthers),
      ...createList("İşləri həyata keçirmək", result.makeThingsHappen),
      ...createList("Liderlik bacarıqlarını inkişaf etdirmək üçün addımlar", result.leadershipDevelopment),

      ...createText(["Qərar vermə", result.makingDecisions]),
      ...createList("Qərar vermənin güclü tərəfləri", result.decisionStrengths),
      ...createList("Qərar vermənin çətin tərəfləri", result.decisionChallenges),
      ...createList("Qərar vermə bacarıqlarını inkişaf etdirmək üçün addımlar", result.decisionActionSteps),

      ...createText(["Tapşırıqları yerinə yetirmə", result.gettingThingsDone]),
      ...createList("Tapşırıqda kömək edən hallar", result.tasksHelp),
      ...createList("Tapşırıqda narahatlıq yaradan hallar", result.tasksIrritate),
      ...createList("Tapşırıq bacarıqlarını inkişaf etdirmək üçün addımlar", result.tasksActionSteps),

      ...createText(["İnkişaf və öyrənmə", result.growthAndDevelopment]),
      ...createList("Öyrənməyi yaxşılaşdıran hallar", result.learningImproved),
      ...createList("Öyrənməyə mane olan hallar", result.learningHindered),
      ...createList("Dəyişikliyə baxış", result.howYouViewChange),
      ...createList("İnkişaf imkanları", result.opportunitiesForGrowth),

      ...createText(["Stress ilə başa çıxma", result.copingWithStress]),
      ...createList("Stress tetikleyiciləri", result.stressTriggers),
      ...createList("Ən yaxşı stress reaksiyaları", result.bestStressResponse),
      ...createList("Başkalarının stressdə köməyi", result.othersHelpStress),
      ...createList("Ən pis stress reaksiyaları", result.worstStressResponse),
      ...createList("Başkalarının stressi artıran davranışları", result.othersWorsenStress),

      ...createText(["Uğura çatmaq", result.achievingSuccess]),
      ...createList("Potensial problemlər", result.potentialProblems),
      ...createList("Tövsiyələr – etməli olduğunuz", result.suggestionsDo),
      ...createList("Tövsiyələr – etməməli olduğunuz", result.suggestionsDont),
    ];

    // Chart üçün ImageRun
    const chartDiv = document.querySelector(".pdf-chart") as HTMLElement;
    let chartImage: ImageRun | null = null;

    if (chartDiv) {
      const canvas = await html2canvas(chartDiv, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      chartImage = new ImageRun({
        data: array,
        transformation: { width: 500, height: 700 },
        type: "png", // bu olmadan TypeScript səhv verəcək
      });
    }

    const doc = new Document({
      sections: [
        { children: sections },
        ...(chartImage
          ? [
            {
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Nəticə diaqramı",
                      bold: true,
                      size: 28,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                new Paragraph({
                  children: [chartImage], // <-- ImageRun indi Paragraph içində
                }),
              ],
            },
          ]
          : []),
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `MBTI-${userType}-result.docx`);
  };


  const renderList = (title: any, items: any) => (
    <div className="pdf-section">
      <h4 className="font-bold text-3xl text-primary-blue mt-12">{title}</h4>
      <ul className="list-disc pl-6">
        {items.map((item: any, idx: any) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      if (userType) {
        try {
          const res = await API.Tests.personalityType(userType);
          const data = res.data;

          const mappedResult = {
            ...data,
            name: data.name,
            summary: data.summary,
            workplacePersonality: data.workplace_personality,
            keyMotivators: data.key_motivators,
            idealWorkEnvironment: data.ideal_work_environments,
            coreValues: data.core_values,
            preferredWorkTasks: data.preferred_work_tasks,
            contributionsToOrganization: data.contributions_to_organization,
            workingWithTeam: data.working_with_team,
            teamHelp: data.team_helps,
            teamIrritate: data.team_irritates,
            teamActionSteps: data.team_action_steps,
            communicatingWithOthers: data.communicating_with_others,
            communicationStrengths: data.communication_strengths,
            communicationMisunderstanding: data.communication_misunderstanding,
            communicationActionSteps: data.communication_action_steps,
            managingConflict: data.managing_conflict,
            conflictHelp: data.conflict_help,
            conflictTriggeredBy: data.conflict_triggered_by,
            conflictIrritate: data.conflict_irritate,
            conflictActionSteps: data.conflict_action_steps,
            takingTheLead: data.taking_the_lead,
            inspireOthers: data.inspire_others,
            makeThingsHappen: data.make_things_happen,
            leadershipDevelopment: data.leadership_development,
            makingDecisions: data.making_decisions,
            decisionStrengths: data.decision_strengths,
            decisionChallenges: data.decision_challenges,
            decisionActionSteps: data.decision_action_steps,
            gettingThingsDone: data.getting_things_done,
            tasksHelp: data.tasks_help,
            tasksIrritate: data.tasks_irritate,
            tasksActionSteps: data.tasks_action_steps,
            growthAndDevelopment: data.growth_and_development,
            learningImproved: data.learning_improved,
            learningHindered: data.learning_hindered,
            howYouViewChange: data.how_you_view_change,
            opportunitiesForGrowth: data.opportunities_for_growth,
            copingWithStress: data.coping_with_stress,
            stressTriggers: data.stress_triggers,
            bestStressResponse: data.best_stress_response,
            othersHelpStress: data.others_help_stress,
            worstStressResponse: data.worst_stress_response,
            othersWorsenStress: data.others_worsen_stress,
            achievingSuccess: data.achieving_success,
            potentialProblems: data.potential_problems,
            suggestionsDo: data.suggestions_do,
            suggestionsDont: data.suggestions_dont,
          };
          setResult(mappedResult);
        } catch (e) {
          console.error("Error loading personality type:", e);
        }
      }
    };
    init();
  }, [userType]);

  if (!result) return <p>{t("test_result.loading")}</p>;

  return (
    <div>
      {/* Header */}
      <div className="bg-primary-blue">
        <div className="container mx-auto px-2 py-16 flex items-center justify-between">
          <h2 className="text-white text-6xl font-bold w-1/2 leading-tight">
            {t("test_result.result_title")}
          </h2>
          <img className="w-40" src={image} alt={userType} />
        </div>
      </div>

      <div ref={pdfRef} className="container mx-auto px-2 py-20 flex flex-col md:flex-row gap-10 justify-between">
        <div className="w-full md:w-full flex flex-col gap-6 text-lg">
          <div className="pdf-section" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h4 className="font-bold text-3xl text-primary-blue">{userType} kimdir?</h4>
            <button
              onClick={downloadPDF}
              className="bg-zinc-100 text-primary-blue px-6 py-3 rounded-lg font-semibold hover:bg-zinc-300 transition pdf-hide"
            >
              {t("test_result.download")}
            </button>
          </div>

          <div className="pdf-section">
            <p>{result.summary}</p>
            <p>{result.workplacePersonality}</p>
          </div>

          {renderList("Əsas motivatorlar", result.keyMotivators)}
          {renderList("İdeal iş mühiti", result.idealWorkEnvironment)}
          {renderList("Əsas dəyərlər", result.coreValues)}
          {renderList("Sevdiyi iş tapşırıqları", result.preferredWorkTasks)}
          {renderList("Təşkilata töhfələr", result.contributionsToOrganization)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Komanda ilə işləmə tərzi</p>
            <p>{result.workingWithTeam}</p>
          </div>
          {renderList("Komandaya kömək edə biləcək bacarıqlar", result.teamHelp)}
          {renderList("Komandada narahatlıq yaradan hallar", result.teamIrritate)}
          {renderList("Komanda bacarıqlarını inkişaf etdirmək üçün addımlar", result.teamActionSteps)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Ünsiyyət</p>
            <p>{result.communicatingWithOthers}</p>
          </div>
          {renderList("Ünsiyyətdə güclü tərəflər", result.communicationStrengths)}
          {renderList("Ünsiyyət problemləri", result.communicationMisunderstanding)}
          {renderList("Ünsiyyət bacarıqlarını inkişaf etdirmək üçün addımlar", result.communicationActionSteps)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Münaqişələrin idarəsi</p>
            <p>{result.managingConflict}</p>
          </div>
          {renderList("Münaqişəyə kömək", result.conflictHelp)}
          {renderList("Münaqişə yaradan hallar", result.conflictTriggeredBy)}
          {renderList("Münaqişədə narahat edən hallar", result.conflictIrritate)}
          {renderList("Münaqişə bacarıqlarını inkişaf etdirmək üçün addımlar", result.conflictActionSteps)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Liderlik</p>
            <p>{result.takingTheLead}</p>
          </div>
          {renderList("Başqalarını ilhamlandırmaq üçün yollar", result.inspireOthers)}
          {renderList("İşləri həyata keçirmək", result.makeThingsHappen)}
          {renderList("Liderlik bacarıqlarını inkişaf etdirmək üçün addımlar", result.leadershipDevelopment)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Qərar vermə</p>
            <p>{result.makingDecisions}</p>
          </div>
          {renderList("Qərar vermənin güclü tərəfləri", result.decisionStrengths)}
          {renderList("Qərar vermənin çətin tərəfləri", result.decisionChallenges)}
          {renderList("Qərar vermə bacarıqlarını inkişaf etdirmək üçün addımlar", result.decisionActionSteps)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Tapşırıqları yerinə yetirmə</p>
            <p>{result.gettingThingsDone}</p>
          </div>
          {renderList("Tapşırıqda kömək edən hallar", result.tasksHelp)}
          {renderList("Tapşırıqda narahatlıq yaradan hallar", result.tasksIrritate)}
          {renderList("Tapşırıq bacarıqlarını inkişaf etdirmək üçün addımlar", result.tasksActionSteps)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">İnkişaf və öyrənmə</p>
            <p>{result.growthAndDevelopment}</p>
          </div>
          {renderList("Öyrənməyi yaxşılaşdıran hallar", result.learningImproved)}
          {renderList("Öyrənməyə mane olan hallar", result.learningHindered)}
          {renderList("Dəyişikliyə baxış", result.howYouViewChange)}
          {renderList("İnkişaf imkanları", result.opportunitiesForGrowth)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Stress ilə başa çıxma</p>
            <p>{result.copingWithStress}</p>
          </div>
          {renderList("Stress tetikleyiciləri", result.stressTriggers)}
          {renderList("Ən yaxşı stress reaksiyaları", result.bestStressResponse)}
          {renderList("Başkalarının stressdə köməyi", result.othersHelpStress)}
          {renderList("Ən pis stress reaksiyaları", result.worstStressResponse)}
          {renderList("Başkalarının stressi artıran davranışları", result.othersWorsenStress)}

          <div className="pdf-section">
            <p className="mt-8 font-semibold text-lg">Uğura çatmaq</p>
            <p>{result.achievingSuccess}</p>
          </div>
          {renderList("Potensial problemlər", result.potentialProblems)}
          {renderList("Tövsiyələr – etməli olduğunuz", result.suggestionsDo)}
          {renderList("Tövsiyələr – etməməli olduğunuz", result.suggestionsDont)}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-2/5">
          <div className="border border-solid border-zinc-300 rounded-lg h-fit overflow-hidden sticky top-[115px]">
            <div className="p-2 text-center bg-zinc-100">
              <p className="text-xl font-semibold text-stone-800 pb-4">Sizin nəticəniz</p>
              <p className="text-primary-blue font-bold text-lg">{userType}</p>
            </div>

            <div className="pdf-chart">
              <SidebarChart
                scores={user?.tests?.find((test) => test.id === Number(testSelected))?.result_values || {}}
                scaleData={scaleData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
