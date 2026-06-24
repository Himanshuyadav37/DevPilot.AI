import "./RecentExecution.css";

function RecentExecution() {

  const executions = [
    {
      id: "NF-1024",
      project: "AI Resume Analyzer",
      status: "Success"
    },
    {
      id: "NF-1025",
      project: "CRM SaaS",
      status: "Running"
    },
    {
      id: "NF-1026",
      project: "Inventory System",
      status: "Failed"
    }
  ];

  return (

    <div className="execution-card">

      <div className="section-header">

        <h2>
          Recent Executions
        </h2>

      </div>

      {executions.map((item) => (

        <div
          key={item.id}
          className="execution-row"
        >

          <div>

            <h4>
              {item.project}
            </h4>

            <p>
              {item.id}
            </p>

          </div>

          <span
            className={`status ${item.status.toLowerCase()}`}
          >
            {item.status}
          </span>

        </div>

      ))}

    </div>

  );

}

export default RecentExecution;