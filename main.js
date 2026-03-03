document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('feature-selector');
    const container = document.getElementById('content-container');

    // 1. localStorageから前回の選択を取得（なければデフォルトをdinner_rouletteに）
    const lastSelectedFeature = localStorage.getItem('selectedFeature') || 'dinner_roulette';

    // セレクトボックスの初期値を設定
    selector.value = lastSelectedFeature;

    // 2. 機能の読み込み関数
    async function loadFeature(featureName) {
        try {
            // featuresフォルダ内の対応するHTMLファイルをフェッチ
            const response = await fetch(`features/${featureName}.html`);
            if (!response.ok) throw new Error('ファイルの読み込みに失敗しました');

            const html = await response.text();

            // コンテナにHTMLを流し込む
            container.innerHTML = html;

            // ★追加処理：innerHTMLで挿入した<script>は自動実行されないため、手動で再生成して実行する
            const scripts = container.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

            // 状態をlocalStorageに保存
            localStorage.setItem('selectedFeature', featureName);

        } catch (error) {
            console.error(error);
            container.innerHTML = '<div class="app-container"><p>エラーが発生しました。ローカルサーバー環境で実行しているか確認してください。</p></div>';
        }
    }

    // 3. 初回読み込み時の実行
    loadFeature(lastSelectedFeature);

    // 4. ドロップダウンが変更されたときのイベント
    selector.addEventListener('change', (event) => {
        loadFeature(event.target.value);
    });
});