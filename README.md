# 桌遊清單

簡單的桌遊清單展示，可以透過 `?s=<store>` 的方式來顯示自己的桌遊清單資料，例如[這裡](https://boardgames.0x148.com)與[範例](https://boardgames.0x148.com?s=googlesheet:2PACX-1vS8wXhjJ1HFHNmpv9IUaOiuBDAv_renKca9uYpLlQiKNCqJLeYwBilUPQW6MBPpdHJzL6ImMs6CcAVY)

## 資料來源

目前支援三種資料來源

其中遊戲 ID 與遊戲名稱為必須，遊戲 ID 是不重複的任意字串，其他欄位則都為可選

如果有設定 BGG ID 則會在找不到對應遊戲圖片的時候，嘗試去找 [BoardGameGeek](https://boardgamegeek.com) 上相應遊戲的圖片

BGG ID 可以在遊戲頁面的網址上找到，例如阿瓦隆的網址為 https://boardgamegeek.com/boardgame/128882 其中的 128882 就是阿瓦隆的 BGG ID

### JSON

內部的資料結構，參數格式為 `json:<path/to/data.json>`

其中的 `/path/to/data.json` 可以是相對路徑 (必須要先部署檔案) 也可以是絕對路徑網址 (完整的網址，如果網站在 HTTPS 環境中，這個參數的網址也必須要是 HTTPS 的網址)

範例：
 - `json:data.json`
 - `json:/assets/data.json`
 - `json:https://example.com/games.json`

結構：
```json
{
  "version": "v1",
  "games": [
    {
      "id": "string, required",
      "name": "string, required",
      "bggId": "string, nullable",
      "originalName": "string, nullable",
      "description": "string, nullable",
      "label": "string, nullable",
      "image": "string, nullable",
      "types": [
        "string"
      ],
      "minimalPlayers": "number",
      "maximalPlayers": "number",
      "minimalMinutes": "number",
      "maximalMinutes": "number",
      "tags": [
        "string"
      ]
    },
  ],
}
```

### Notion

使用 Notion 作為資料來源，參數格式為 `notion:<database_id>`

可以複製[這個](https://mirage-chamomile-ad3.notion.site/73ed29a34fa045f6b24c488fc767f10f)資料庫作為範本開始

步驟：
 - 將 Notion 中的 database 分享給 Integration
 - 將 Integration 的 Secret Token 設定到 `SERVER_NOTION_TOKEN` 中
 - 在資料庫中加入下列結構中的 properties 到 database 上
 - 取得資料庫的 datbase id
 - 設定資料來源為 `notion:<database_id>`

結構：
 - `[BGG]: NAME`: 遊戲名稱 (必填)
 - `[BGG]: INCLUDE`: 勾選後才會顯示
 - `[BGG]: BGGID`: 設定在 [BoardGameGeek](https://boardgamegeek.com/) 上的遊戲 ID
 - `[BGG]: ORIGINAL-NAME`: 遊戲原名，如果有設定的話會顯示在遊戲名稱下面
 - `[BGG]: DESCRIPTION`: 遊戲描述
 - `[BGG]: LABEL-TEXT`: 遊戲的 Label (文字)
 - `[BGG]: IMAGE`: 遊戲的圖片
 - `[BGG]: TYPES`: 遊戲類型，多個可以用半形逗號、全形頓號或空格分隔
 - `[BGG]: MIN-PLAYERS`: 最少遊戲人數
 - `[BGG]: MAX-PLAYERS`: 最多遊戲人數
 - `[BGG]: MIN-MINUTES`: 最少遊戲時間 (分鐘)
 - `[BGG]: MAX-MINUTES`: 最多遊戲時間 (分鐘)
 - `[BGG]: TAGS`: 遊戲標籤，多個可以用半形逗號、全形頓號或空格分隔

### GoogleSheet

使用 Google Sheet 作為資料來源，參數格式為 `googlesheet:<csv_id>`

可以複製[這個](https://docs.google.com/spreadsheets/d/1PQOfpB24-R4_e_BFL9hPSONpHodL7RFH-QO51C4vXW0)表格作為範本開始，編輯完成後選擇「檔案」然後「發佈到網路」，並選擇「整份文件」與「逗號分隔值 (.csv)」之後會得到類似 `https://docs.google.com/spreadsheets/d/e/<csv_id>/pub?output=csv` 這樣的一個網址，將其中的 `csv_id` 複製下來

第一橫列要是欄位名稱，例如 `NAME` (大小寫無關) 接著每一列都是一筆遊戲資料；由於是採用 csv 輸出，因此整個表格都盡可能不要使用半形逗號；編輯更新之後，可能會需要等 10 分鐘才會看到編輯後更新的結果

結構：
 - `ID`: 任意字串，但必須要不重複
 - `NAME`: 遊戲名稱，必填
 - `BGGID`: 如果有的話會顯示連結，並且在沒有設定 `IMAGE` 的時候使用 [BoardGameGeek](https://boardgamegeek.com/) 上的圖片
 - `ORIGINAL_NAME`: 遊戲原名
 - `DESCRIPTION`: 遊戲描述
 - `LABEL`: 遊戲的 Label (文字)
 - `IMAGE`: 遊戲的圖片，需要是 HTTPS 網址
 - `TYPES`: 遊戲類型，多個可以用全形頓號或空格分隔
 - `MINIMAL_PLAYERS`: 最少遊戲人數
 - `MAXIMAL_PLAYERS`: 最多遊戲人數
 - `MINIMAL_MINUTES`: 最少遊戲時間 (分鐘)
 - `MAXIMAL_MINUTES`: 最多遊戲時間 (分鐘)
 - `TAGS`: 遊戲標籤，多個可以用全形頓號或空格分隔

另外一些其他的欄位也可以使用，這是為了和現有的其他桌遊清單格式相容：
 - `IMGUR`: 與 `IMAGE` 相同，如果和 `IMAGE` 一起設定的話 `IMAGE` 優先
 - `GAMETYPE`: 與 `TYPES` 相同，會和 `TYPES` 合併
 - `PLAYER`: 遊戲人數，可以用 `N` 或 `N-M` 或 `N~M` 這樣的格式
 - `TAG`: 與 `TAGS` 相同，會和 `TAGS` 合併
 - `PLAYTIME`: 遊戲時間，可以用 `N` 或 `N-M` 或 `N~M` 這樣的格式

## 環境變數

透過環境變數可以調整程式的行為

### Client 環境變數
 - `VITE_ENABLE_SOURCE_QUERY`: 是否啟用從參數設定資料來源的方式，如果啟用，可以透過 Query String (`?s=...` or `?store=...` or `?source=...`) 的方式設定資料來源，格式為 `<store>:<params>`

 - `VITE_DEFAULT_STORE`: 如果沒有給參數時所使用的資料來源，如果沒有設定，有可能會顯示沒有資料來源的錯誤訊息

### Server 環境變數
 - `SERVER_ENABLE_NOTION_QUERY`: 是否允許使用 Notion Integration (需要部署 Serverless Functions)
 - `SERVER_NOTION_TOKEN`: 設定 Notion Integration 的 Secret Token

## 開發

```bash
npm install
npm run dev
```
