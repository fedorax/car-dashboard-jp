# Conversation サンプルアプリケーション

デモ画面  
  
![デモ](readme_images/car-dash-jp.gif)  
  
このアプリケーションはWaston Developers Cloud上で公開されている[サンプルアプリ car dashboard][car-dashboad]をベースに音楽演奏機能を追加したものです。  
Watson APIのうち、Conversation, Speech to Text, Text to Speechを使っており、この3つのAPIの機能を知るのにいいサンプルとなっています。  
音声認識も利用する場合は、ブラウザにFirefoxを使うようにして下さい。  
  このデモでアプリは、次のような会話が可能です。  
 
### 機器の操作 (「ライトをつけて」など)
ライト、ワイパー、クーラー、ヒーターの ON / OFF
### 音楽の演奏 (「音楽を演奏して」など)  
曲のジャンル: ロック、クラシック、ジャズ、ポップス、演歌
### レストランの案内 (「おなかがすいた」など)
レストランの種類: 和食、中華、イタリアン  

## 事前準備

### Bluemixアカウントの準備
[Bluemixアカウントを作る][sign_up] か、あるいは既存のBluemixアカウントを利用します。

### 前提ソフトの導入
次の前提ソフトを導入します。Node.jsはローカルで動かす場合に必要となります。      [gitコマンドラインツール][git]     [Cloud Foundryコマンドラインツール][cloud_foundry]    [Node.js][node_js]   注意: Cloud Foundaryのバージョンは最新として下さい。### サービスの作成
デモで利用する、Conversation, Speech to Text, Text to Speechの3つのWatsonサービスを作成します。  
Conversationサービスの作成手順は以下の通りです。  

Bluemixダッシュボードから「カタログ」「Watson」「Conversation」を順に選択  

![userid](readme_images/crt-conv.png)  
 　   
下記の画面が表示されたら、すべてデフォルト値のまま「作成」を選択  
  
![userid](readme_images/crt-conv2.png)  
  
Speech to Text、Text to Speechに関しても同様のことを繰り返します。 ### ソースのダウンロードカレントディレクトリのサブディレクトリにソースはダウンロードされるので、あらかじめ適当なサブディレクトリを作り、そこにcdしておきます。

```
git clone https://git.ng.bluemix.net/akaishi/car-dashboard-jp.git
```

### サンプルワークスペースの作成
ダッシュボードの画面から先ほど作成したConversationサービスを選択し、次の画面を表示します。  
  
![userid](readme_images/crt-workspace.png)  
   
下にある「Import Workspace」のアイコンをクリックします。  
　
![userid](readme_images/crt-workspace2.png) 
下の画面が表示されたら、まず「Choose a file」で先ほどダウンロードしたソース配下の training/car-dachboard-jp.jsonを選択し、「Import」ボタンをクリックします。  

![userid](readme_images/crt-workspace3.png)  　
　### 環境変数の確認デモを動かすのに必要な以下の環境変数の値を調べ、テキストエディタなどにコピーします。  
(ローカル環境で動作確認をしない場合は、WORKSPACE_ID以外の確認は不要です)```  WORKSPACE_ID
CONVERSATION_USERNAME
CONVERSATION_PASSWORD
TEXT_TO_SPEECH_USERNAME
TEXT_TO_SPEECH_PASSWORD
SPEECH_TO_TEXT_USERNAME
SPEECH_TO_TEXT_PASSWORD
```    CONVERSATION\_USERNAMEとCONVERSATION\_PASSWORDは、Conversationサービス管理画面から「資格情報」「資格情報の表示」を選択      ![userid](readme_images/conv-userid.png)  

TEXT\_TO\_SPEECH\_USERNAME、TEXT\_TO\_SPEECH\_PASSWORD、
SPEECH\_TO\_TEXT\_USERNAME、SPEECH\_TO\_TEXT\_PASSWORDも同様のやり方で調べます。      WORDSPACE\_IDは、Conversaionサービス管理画面から「Launch Tool」ワークスペースごとの詳細メニューから「View Deatails」を選択して確認します。    ![workspace](readme_images/conv-workspaceid.png)        ## ローカル環境へのデプロイ### プログラムの導入次のコマンドを実行して必要なモジュールを導入します。```cd car-dashboard-jpnpm install
npm run build```### 環境変数の設定カレントディレクトリにあるlocal.env.sampleをlocal.envにコピーします。    ```cp local.env.sample local.env```  local.envをテキストエディタで開いて、下記の項目にそれぞれの値を設定して下さい。  ```          WORKSPACE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxCONVERSATION_USERNAME=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxCONVERSATION_PASSWORD=xxxxxxxxxxxx
SPEECH_TO_TEXT_PASSWORD=xxxxxxxxxxxxSPEECH_TO_TEXT_USERNAME=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TEXT_TO_SPEECH_USERNAME=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TEXT_TO_SPEECH_PASSWORD=xxxxxxxxxxxx```          設定が完了したら、次のコマンドでnode.jsを起動します。  ```npm start```正常にNode.jsが起動できていれば、ブラウザから [http://localhost:3000][local_url] のURLでアプリケーションを起動できます。  ## Bluemix環境へのデプロイ### プログラムの配布cf loginコマンドではemailとpasswordを聞かれるのでbluemix登録時のemailアドレスとパスワードを指定します。   cf pushコマンドで指定する \<your\_appl\_name\> はBluemix上のインスタンス名であると同時に、インターネット上のURL名にもなるので、ユニークなものを指定します。  ```cd car-dashboard-jpcf logincf push <your_appl_name>```### サービスのバインド
前の手順でローカル環境でNode.jsを動かしている場合、cf pushコマンドでlocal.envファイルのコピーも行われるので、以下の手順は必要ありません。  この手順はローカルでのテストを省いてBluemix上で動かす場合、または継続的開発環境の設定をBluemix上で行いGithub上のソースをBluemix環境に直接デプロイする場合に必要となります。 Cloud Foundaryアプリのリストの中から先ほど作成したCar Dashboardのアプリケーションを選択し、下の管理画面を表示させます。  画面から「接続」「既存に接続」を選択し、Discovery、Speech to Text、Text to Speechの3つのサービスを順に選択します。
![setting](readme_images/bind-service.png)  設定のたびに「アプリの再ステージ」の質問が出ますが、すべて「キャンセル」を選択します。  

![setting](readme_images/stage.png)  　### 環境変数のセット  WORKSPACE_IDに関しては、CloudFoundary管理画面から、「ランタイム」「環境変数」を選択して設定します。      ![setting](readme_images/set-env.png)  右のペインを下にスクロールして「追加」ボタンをクリックし、WORKSPACE_IDとその値を設定して、「保存」をクリックします。![setting](readme_images/set-env2.png)      ### アプリケーションのURLと起動環境変数を保存すると自動的に再構成が動き出します。  しばらくしてこれが完了したら、下記の画面で該当するCloud Foundaryアプリケーションの「経路」のリンクをクリックするとアプリケーションが起動されます。    ![call-appl](readme_images/call-appl.png)  [car-dashboad]: https://github.com/watson-developer-cloud/car-dashboard
[node_js]: https://nodejs.org/#download[cloud_foundry]: https://github.com/cloudfoundry/cli#downloads[git]: https://git-scm.com/downloads[npm_link]: https://www.npmjs.com/[sign_up]: https://bluemix.net/registration[demo]: https://git.ng.bluemix.net/akaishi/conv-ui-sample/blob/master/readme_images/conv-sample2.gif[local_url]: http://localhost:3000