// Take in a {stock ticker, a 10k, and a price, a tea, and a snack} x 2
// enter desired video length
// Return a video script

// The video script will have a beginning, middle, escalation, climax, denoument, and conclusion that tees up the next video with a preview of the next tea, company, and snack

// The stock analysis will be Grahamian. The 10k will be split into sections via xbrl parsing and fed to the trained ai for analysis. The price will be analzyzed via fundamental analysis. Price is what you pay, value is what you get

// The tea analysis will include cultural appreciation (tea preparation stories, history, cultural claims to fame, and more) and language word of the day with translation and pronounciation

// At the end of each episode, I will give each stock, tea, and snack a buy or pass rating
import Link from "next/link";

import saveTask from "../../utils/saveTask";
import { useState } from "react";
import { set } from "lodash";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = await getSession(context.req, context.res);
    // const user = ;
    const userId = session?.user.sub;

    return {
      props: { userId },
    };
  },
});
export default function CreateVideoScript({ userId }) {
  const [tenKhtml, setTenKhtml] = useState("");
  const [createVideoInput, setCreateVideoInput] = useState("");
  const [stockAndIndexPriceHistoryInput, setStockAndIndexPriceHistoryInput] =
    useState("");
  //   const [priceData, setPriceData] = useState("");
  const [price, setPrice] = useState("");
  const [shares, setShares] = useState("");
  const [yahooRatios, setYahooRatios] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyTicker, setCompanyTicker] = useState("");
  const [teaName, setTeaName] = useState("");
  const [snackName, setSnackName] = useState("");
  const channelName = "Marvin da Millennium Macchiiato";
  const [nextStock, setNextStock] = useState("");
  const [nextTea, setNextTea] = useState("");
  const [nextSnack, setNextSnack] = useState("");

  const [stockAndIndexPriceHistory, setStockAndIndexPriceHistory] =
    useState("");
  const showName = "Stock Sips and Snacks";
  // const [businessSummary, setBusinessSummary] = useState("");

  // const inputStyle = {
  //   borderRadius: "8px",
  //   borderWidth: "0px",
  //   backgroundColor: "#000",
  //   color: "white",
  //   border: "1px solid grey",
  //   height: "2em",
  //   flexGrow: 1,
  //   textIndent: "10px",
  // };
  // async function handle10k({ tenKhtml }) {
  //   console.log("tenKhtml");
  //   console.log(tenKhtml);

  //   setTenKhtml(tenKhtml);

  //   // const businessSummary = await generateBusinessSummaryFrom10k({ tenKhtml });
  //   // setBusinessSummary(businessSummary);
  // }
  // async function generateBusinessSummaryFrom10k({ tenKhtml }) {
  //   console.log("generateBusinessSummaryFrom10k");

  //   try {
  //     const response = await fetch(
  //       "/api/stock-sips/generate-business-summary-from-10k",
  //       {
  //         method: "POST",
  //         body: JSON.stringify({ tenKhtml }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       // If the response is not 2xx, throw an error
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("data", data);
  //     return data;
  //     // setTenKsummary(data); // Assuming this is a state update in a React component
  //   } catch (error) {
  //     console.error("Error in generateBusinessSummaryFrom10k:", error);
  //     // Handle errors here, such as setting an error state in your component
  //   }
  // }

  async function handleSubmit() {
    console.log("handleSubmit");
    const createVideoObj = await handleCreateVideoJson(createVideoInput);
    if (!createVideoObj) {
      return console.log("no createVideoObj");
    }
    console.log("createVideoObj");
    console.log(createVideoObj);
    const priceHistoryObj = await handleCreatePriceHistoryJson(
      stockAndIndexPriceHistoryInput
    );
    if (!priceHistoryObj) {
      return console.log("no priceHistoryObj");
    }
    console.log("priceHistoryObj");
    console.log(priceHistoryObj);

    // const businessSummary = await generateBusinessSummaryFrom10k({ tenKhtml });
    // console.log("businessSummary");
    // console.log(businessSummary);
    const price = createVideoObj.stockPrice;
    const shares = createVideoObj.stockShares;
    const companyName = createVideoObj.companyName;
    // const price = createVideoObj.stockTickerPriceAndShares.split("\t")[2];
    // const shares = createVideoObj.stockTickerPriceAndShares.split("\t")[3];
    const yahooRatios = createVideoObj.yahooFinanceRatios;
    const companyTicker = createVideoObj.companyTicker;
    // const companyName = createVideoObj.stockTickerPriceAndShares.split("\t")[1];
    // const companyTicker =
    // createVideoObj.stockTickerPriceAndShares.split("\t")[0];
    const teaName = createVideoObj.tea;
    const snackName = createVideoObj.snack;
    const nextStock = createVideoObj.nextStock;
    const nextTea = createVideoObj.nextTea;
    const nextSnack = createVideoObj.nextSnack;
    const russell1000History = priceHistoryObj.russell1000History;
    const stockHistory = priceHistoryObj.stockHistory;
    // handleCompanyName(createVideoObj.stockTickerPriceAndShares.split("\t")[1]);
    // handleTickerNamePriceShares(createVideoObj.stockTickerPriceAndShares);
    // handleRatios(createVideoObj.yahooFinanceRatios);
    // handleTea(createVideoObj.tea);
    // handleSnack(createVideoObj.snack);
    // handleNextStock(createVideoObj.nextStock);
    // handleNextTea(createVideoObj.nextTea);
    // handleNextSnack(createVideoObj.nextSnack);
    if (!companyTicker) {
      return console.log("ERROR 564! no companyTicker");
    }
    if (!companyName) {
      return console.log("ERROR 564! no companyName");
    }
    if (!price) {
      return console.log("ERROR 564! no price");
    }
    if (!shares) {
      return console.log("ERROR 564! no shares");
    }
    if (!yahooRatios) {
      return console.log("ERROR 564! no yahooRatios");
    }
    if (!teaName) {
      return console.log("ERROR 564! no teaName");
    }
    if (!snackName) {
      return console.log("ERROR 564! no snackName");
    }
    if (!nextStock) {
      return console.log("ERROR 564! no nextStock");
    }
    if (!nextTea) {
      return console.log("ERROR 564! no nextTea");
    }
    if (!nextSnack) {
      return console.log("ERROR 564! no nextSnack");
    }
    if (!russell1000History) {
      return console.log("ERROR 564! no russell1000History");
    }

    // if (!businessSummary) {
    //   return console.log("ERROR 564! no businessSummary");
    // }

    const scriptInputs = {
      userId,
      // businessSummary,
      price,
      shares,
      yahooRatios: JSON.stringify(yahooRatios),
      companyName,
      companyTicker,
      teaName,
      snackName,
      channelName,
      showName,
      nextStock,
      nextTea,
      nextSnack,
      russell1000History,
      stockHistory,
    };

    const newVideoScriptTask = {
      type: "generateYoutubeScript",
      status: "queued",
      userId,
      context: {
        ...scriptInputs,
      },
      createdAt: new Date().toISOString(),
    };

    const newVideoScriptTaskResponse = await saveTask(newVideoScriptTask);
    console.log("newVideoScriptTaskResponse");
    console.log(newVideoScriptTaskResponse);
  }

  function handleCreateVideoInput(createVideoInput) {
    setCreateVideoInput(createVideoInput);
  }

  function handleStockAndIndexPriceHistory(stockAndIndexPriceHistoryInput) {
    setStockAndIndexPriceHistoryInput(stockAndIndexPriceHistoryInput);
  }
  async function handleCreateVideoJson(createVideoInput) {
    try {
      const response = await fetch(
        "/api/stock-sips/generate-create-episode-script-form-json",
        {
          method: "POST",
          body: JSON.stringify({
            createEpisodeScriptFormInput: createVideoInput,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      try {
        const createVideoObjJson = await response.json();
        const createVideoObj = JSON.parse(
          createVideoObjJson.createEpisodeFormJson
        );
        console.log("createVideoObj", createVideoObj);
        return createVideoObj;
      } catch {
        console.log("invalid json");
      }
    } catch (error) {
      console.error("Error in handleCreateVideoJson:", error);
    }
  }
  async function handleCreatePriceHistoryJson(stockAndIndexPriceHistoryInput) {
    try {
      const response = await fetch("/api/stock-sips/get-price-history-json", {
        method: "POST",
        body: JSON.stringify({
          stockAndIndexPriceHistoryInput,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      try {
        const priceHistoryJsonObj = await response.json();
        const priceHistoryObj = JSON.parse(
          priceHistoryJsonObj.priceHistoryJson
        );
        console.log("priceHistoryObj", priceHistoryObj);
        return priceHistoryObj;
      } catch {
        console.log("invalid json");
      }
    } catch (error) {
      console.error("Error in handlepriceHistoryObj:", error.response);
    }
  }

  return (
    <>
      <h1>Create Video Script</h1>
      <Link
        target="_blank"
        href="https://docs.google.com/spreadsheets/d/16KYSeQv4UScwNb3oXVijpuAK8j-SYwidedFWhIfONbA/edit#gid=660549284"
      >
        Prices
      </Link>

      <div>
        <Link
          target="_blank"
          href={`https://finance.yahoo.com/quote/${companyTicker}/key-statistics?p=${companyTicker}`}
        >
          Yahoo Ratios
        </Link>
      </div>
      <code>
        {
          "{stockTickerPriceAndShares: ``, yahooFinanceRatios: ``, tea: ``, snack: ``, nextStock: ``, nextTea: ``, nextSnack: `` }"
        }
      </code>
      <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>
        <textarea
          //   style={inputStyle}
          // disabled={!businessSummary}
          style={{ height: "500px", width: "100%" }}
          placeholder="Enter Create Video JSON"
          onChange={(e) => handleCreateVideoInput(e.target.value)}
        />
      </div>
      <Link target="_blank" href="https://finance.yahoo.com/quote/IWB/history">
        Price History
      </Link>

      <code style={{ marginTop: "20px" }}>
        {"{ stockPriceHistory: ``, russel1000PriceHistory: `` }"}
      </code>
      <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>
        <textarea
          //   style={inputStyle}
          // disabled={!businessSummary}
          style={{ height: "500px", width: "100%" }}
          placeholder="Stock and Index Price History"
          onChange={(e) => handleStockAndIndexPriceHistory(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
