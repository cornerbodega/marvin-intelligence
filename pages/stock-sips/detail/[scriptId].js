import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { createClient } from "@supabase/supabase-js";
import { getSupabase } from "../../../utils/supabase";

const supabase = getSupabase();

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = await getSession(context.req, context.res);
    const userId = session?.user.sub;

    return {
      props: { userId },
    };
  },
});

export default function ScriptDetail({ userId }) {
  const [script, setScript] = useState(null);
  const router = useRouter();
  const { scriptId } = router.query;
  const [episodeScriptArray, setEpisodeScriptArray] = useState([]);
  useEffect(() => {
    async function fetchScript() {
      const { data, error } = await supabase
        .from("youtubeScripts")
        .select("*")
        .eq("scriptId", scriptId)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
      try {
        const episodeScriptArray = JSON.parse(data.episodeScript);
        setEpisodeScriptArray(episodeScriptArray);
      } catch {
        console.log("Error parsing episodeScript");
        console.log(data.episodeScript);
      }
      setScript(data);
    }

    if (scriptId) {
      fetchScript();
    }
  }, [scriptId]);

  if (!script) return <p>Loading...</p>;

  return (
    <div>
      <h1>{script.episodeName}</h1>
      <p>{}</p>
      {/* Display more details as needed */}
      <div>{script.episodeScript}</div>
      {/* <div
        className="text-white"
        dangerouslySetInnerHTML={{ __html: script.episodeScriptHtml }}
      /> */}
    </div>
  );
}
