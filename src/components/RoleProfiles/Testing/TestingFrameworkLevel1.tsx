const TestingFrameworkLevel1 = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <iframe
      src={`${base}/role-profiles/Testing/Testing-Framework-Level-1.html`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Testing-Framework-Level-1"
    />
  );
};

export default TestingFrameworkLevel1;

