import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Map } from "yjs";
import "./App.css";

const yDoc = new Y.Doc();
const websocketProvider = new WebsocketProvider(
    "ws://localhost:1234",
    "spreadsheetData",
    yDoc
);

interface Cell {
    function: string;
    value: string;
}

const yMap = yDoc.getMap<Map<Cell>>("spreadsheet");
const yColumns = yDoc.getArray<string>("columns");
const yRows = yDoc.getArray<string>("rows");

function App() {
    const [connected, setConnected] = useState("Not Connected");
    useEffect(() => {
        websocketProvider.on("status", (event: any) => {
            setConnected(event.status);
        });

        websocketProvider.once("sync", () => {
            if (yRows.length === 0) {
                for (let i = 0; i < 3; i++) {
                    const rowUID = "$row_" + Math.random();
                    const colUID = "$col_" + Math.random();
                    yRows.push([rowUID]);
                    yColumns.push([colUID]);
                }
            } else {
                console.log("Already synced");
            }
        });
    });
    return <>{connected}</>;
}

export default App;
