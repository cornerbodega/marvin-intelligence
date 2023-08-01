import Head from "next/head";
import { Col, Row } from "reactstrap";
import SalesChart from "../../src/components/dashboard/SalesChart";
import Feeds from "../../src/components/dashboard/Feeds";
import ProjectTables from "../../src/components/dashboard/ProjectTable";
import TopCards from "../../src/components/dashboard/TopCards";
import Blog from "../../src/components/dashboard/Blog";
import bg1 from "../src/assets/images/bg/bg1.jpg";
import bg2 from "../src/assets/images/bg/bg2.jpg";
import bg3 from "../src/assets/images/bg/bg3.jpg";
import bg4 from "../src/assets/images/bg/bg4.jpg";
import MyComponent from "../../src/components/dashboard/MyComponent";
const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];
// export const getServerSideProps = async () => {
//   const res = await fetch("https://api.github.com/repos/vercel/next.js");
//   const repo = await res.json();
//   return { props: { repo } };
// };

export const getServerSideProps = async () => {
  // const eggosResponse = await fetch(
  //   new URL("/api/eggo", "http://localhost:3000")
  // );
  // console.log("eggosResponse");
  // console.log(eggosResponse);
  // const eggo = await eggosResponse.json();
  const content = `<html>
  <head>
      <title>How to Build a Successful Tea Business</title>
  </head>
  <body>
      <h1>How to Build a Successful Tea Business</h1>
      <p>Starting a tea business can be a rewarding venture if done correctly. With a growing population of health-conscious consumers and tea enthusiasts around the world, the demand for high-quality tea is increasing. Here are some crucial steps to build a successful tea business.</p>
      <h2>Understand Your Market</h2>
      <p>Conduct a market analysis to understand the current trends, customer needs, and competitive landscape in the tea industry. You need to identify your target audience and tailor your offerings to meet their preferences.</p>

      <h2>Source Quality Tea</h2>
      <p>Quality is paramount in the tea business. Therefore, it's important to establish relationships with reputable suppliers who can provide you with top-quality tea leaves. Sampling different teas can also help you understand their unique flavours and sell points.</p>

      <h2>Create a Unique Brand</h2>
      <p>Develop a brand story that connects with your target audience on an emotional level. This could be your personal journey with tea or a strong mission statement like contributing to environmental sustainability.</p>

      <h2>Develop an Attractive Packaging</h2>
      <p>Your packaging should reflect your brand story and appeal to your target audience. It should not only be aesthetically pleasing but also practical and eco-friendly.</p>

      <h2>Choose the Right Sales Channels</h2>
      <p>Decide whether you want to sell your tea in a physical store, online, or both. If you choose to sell online, focus on creating a user-friendly website and optimizing it for search engines. Also, consider selling on popular e-commerce platforms to reach a wider audience.</p>

      <h2>Implement a Marketing Strategy</h2>
      <p>Utilize both online and offline marketing strategies to reach your target audience. This may include social media marketing, content marketing, influencer collaborations, attending trade shows, and hosting tea tasting events.</p>

      <h2>Provide Excellent Customer Service</h2>
      <p>Ensure that your customers feel valued and cared for. This can be achieved by providing prompt responses to queries, handling complaints professionally, and asking for feedback to improve your services.</p>

      <h2>Continue Learning and Adapting</h2>
      <p>The tea industry, like any other, is constantly evolving. Stay updated with the latest trends, continually learn about different types of tea, and be open to adapting your business model as required.</p>

      <p>In conclusion, building a successful tea business involves thorough market research, quality sourcing, effective branding, attractive packaging, wise choice of sales channels, strategic marketing, excellent customer service, and a commitment to continuous learning. With passion and determination, you can brew your way to success in the tea industry.</p>
   </body>
  </html>
      
      `;
  const title = "How to build a successful tea business";
  // const content = "This will be html with links";
  return {
    props: {
      title,
      content,
    },
  };
};
export default function Home({ title, content }) {
  // const eggos = "eggos";

  return (
    <div>
      <Head>
        <title>Marvinfo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyComponent title={title} content={content} />
      <div>
        {/***Top Cards***/}
        {/* <Row>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-success text-success"
            title="Profit"
            subtitle="Yearly Earning"
            earning="$21k"
            icon="bi bi-wallet"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-danger text-danger"
            title="Refunds"
            subtitle="Refund given"
            earning="$1k"
            icon="bi bi-coin"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-warning text-warning"
            title="New Project"
            subtitle="Yearly Project"
            earning="456"
            icon="bi bi-basket3"
          />
        </Col>
        <Col sm="6" lg="3">
          <TopCards
            bg="bg-light-info text-into"
            title="Sales"
            subtitle="Weekly Sales"
            earning="210"
            icon="bi bi-bag"
          />
        </Col>
        </Row> */}
        {/***Sales & Feed***/}
        {/* <Row>
          <Col sm="12" lg="6" xl="7" xxl="8">
            <SalesChart />
          </Col>
          <Col sm="12" lg="6" xl="5" xxl="4">
            <Feeds />
          </Col>
        </Row> */}
        {/***Table ***/}
        {/* <Row>
          <Col lg="12" sm="12">
            <ProjectTables />
          </Col>
        </Row> */}
        {/***Blog Cards***/}
        {/* <Row>
          {BlogData.map((blg) => (
            <Col sm="6" lg="6" xl="3" key={blg.title}>
              <Blog
                image={blg.image}
                title={blg.title}
                subtitle={blg.subtitle}
                text={blg.description}
                color={blg.btnbg}
              />
            </Col>
          ))}
        </Row> */}
      </div>
    </div>
  );
}

// page 2 content:
