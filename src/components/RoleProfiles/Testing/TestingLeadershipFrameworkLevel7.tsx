const TestingLeadershipFrameworkLevel7 = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return (
    <iframe
      src={`${base}/role-profiles/Testing/Testing-Leadership-Framework-Level-7.html`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Testing-Leadership-Framework-Level-7"
    />
  );
};

export default TestingLeadershipFrameworkLevel7;

