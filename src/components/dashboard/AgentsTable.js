import { useRouter } from "next/router";
import Image from "next/image";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../../../public/default-agents/Agent Pangolin.png";
import user2 from "../../../public/default-agents/Agent Quokka.png";
import user3 from "../../../public/default-agents/Agent Axolotl.png";
import user4 from "../../../public/default-agents/Agent Red Panda.png";
import user5 from "../../../public/default-agents/Agent Pika.png";

const tableData = [
  {
    avatar: user1,
    name: "Agent Pangolin",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user2,
    name: "Agent Quokka",
    email: "hgover@gmail.com",
    project: "Lading pro React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user3,
    name: "Agent Axolotl",
    email: "hgover@gmail.com",
    project: "Elite React",
    status: "holt",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user4,
    name: "Agent Red Panda",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user5,
    name: "Agent Pika",
    email: "hgover@gmail.com",
    project: "Ample React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
];

const ProjectTables = () => {
  const router = useRouter();
  console.log(router);
  function goToPage(name) {
    console.log("go to page");
    console.log(name);
    router.push(`/missions/create-mission/agents/detail/${name}`);
  }
  // export default function Home() {

  // return <></>;
  // }
  return (
    <Card>
      <CardBody>
        {/* <CardTitle tag="h5">Signed Agent Roster</CardTitle> */}
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          {/* Agents Listing */}
        </CardSubtitle>
        <div className="table-responsive">
          <Table className="text-nowrap mt-3 align-middle" borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Expertise</th>

                <th>Status</th>
                <th>Insights</th>
                <th>Missions Completed</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr
                  onClick={() => goToPage(tdata.name)}
                  key={index}
                  className="border-top"
                >
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <Image
                        src={tdata.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="ms-3">
                        <h6 className="mb-0 text-primary">{tdata.name}</h6>
                        <span className="text-muted">{tdata.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{tdata.project}</td>
                  <td>
                    {tdata.status === "pending" ? (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                    ) : tdata.status === "holt" ? (
                      <span className="p-2 bg-warning rounded-circle d-inline-block ms-3" />
                    ) : (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3" />
                    )}
                  </td>
                  <td>{tdata.weeks}</td>
                  <td>{tdata.budget}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProjectTables;
