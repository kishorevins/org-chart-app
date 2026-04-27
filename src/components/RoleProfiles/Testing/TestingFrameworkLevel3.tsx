const TestingFrameworkLevel3 = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <iframe
      src={`${base}/role-profiles/Testing/Testing-Framework-Level-3.html`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Testing-Framework-Level-3"
    />
  );
};

export default TestingFrameworkLevel3;

