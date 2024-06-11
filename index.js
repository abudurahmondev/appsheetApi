const express = require("express");
const { google } = require("googleapis");
const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))


app.get("/", (req,res) =>{
    res.render("index")
})


app.post('/', async (req, res) => {
    const { user_id, name } = req.body
     
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });

        // Create client instance for auth
        const client = await auth.getClient();

        // Instance of Google Sheets API
        const googleSheets = google.sheets({ version: "v4", auth: client });

        const spreadsheetId = "";

        // Get metaData about spreadsheet
        const metaData = await googleSheets.spreadsheets.get({
            spreadsheetId
        });

        // Read rows from spreadsheet
        const getRows = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Tg_users"
        });

        //Write row(s) to spreadsheet
        await googleSheets.spreadsheets.values.append({
            auth, 
            spreadsheetId,
            range: "", //SheetName
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [user_id, name],
                ]
            }
        })

        res.send("Zor!");
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).send('An error occurred while fetching data from Google Sheets');
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
