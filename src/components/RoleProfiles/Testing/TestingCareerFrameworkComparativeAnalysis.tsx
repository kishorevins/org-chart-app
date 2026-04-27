const TestingCareerFrameworkComparativeAnalysis = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <iframe
      src={`${base}/role-profiles/Testing/Testing-Career-Framework-Comparative-Analysis.html`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Testing-Career-Framework-Comparative-Analysis"
    />
  );
};

export default TestingCareerFrameworkComparativeAnalysis;

