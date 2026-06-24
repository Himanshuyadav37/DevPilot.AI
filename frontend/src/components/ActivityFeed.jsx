import "./ActivityFeed.css";

function ActivityFeed(){

  const logs = [
    "Planner completed architecture",
    "Coder generated API layer",
    "Tester found 3 issues",
    "Debugger fixed imports",
    "Deployment ready"
  ];

  return(

    <div className="activity-card">

      <h2>
        Activity Feed
      </h2>

      {
        logs.map(
          (item,index)=>(

            <div
              key={index}
              className="activity-item"
            >
              <span/>
              {item}
            </div>

          )
        )
      }

    </div>

  );
}

export default ActivityFeed;