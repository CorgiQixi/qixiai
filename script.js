document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const sizeOptions = document.querySelectorAll('.size-option');
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt');
    const imagePlaceholder = document.getElementById('image-placeholder');
    const generatedIframe = document.getElementById('generated-iframe');
    const imageActions = document.getElementById('image-actions');
    const downloadBtn = document.getElementById('download-btn');
    const newTabBtn = document.getElementById('new-tab-btn');
    const copyBtn = document.getElementById('copy-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    let selectedSize = 'landscape';
    let currentImageUrl = '';
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.dataset.size;
        });
    });
    
    generateBtn.addEventListener('click', generateImage);
    
    if(downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }
    
    newTabBtn.addEventListener('click', openImageInNewTab);
    copyBtn.addEventListener('click', copyImageUrl);
    
    function downloadImage() {
        if (!currentImageUrl) return;
        const a = document.createElement('a');
        a.href = currentImageUrl;
        a.download = `ai-image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    function openImageInNewTab() {
        if (!currentImageUrl) return;
        window.open(currentImageUrl, '_blank');
    }
    
    function copyImageUrl() {
        if (!currentImageUrl) return;
        navigator.clipboard.writeText(currentImageUrl)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制链接');
            });
    }
    
    function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('请输入图像描述');
            return;
        }
        
        let width, height;
        switch(selectedSize) {
            case 'landscape':
                width = 1024; height = 768;
                break;
            case 'portrait':
                width = 768; height = 1024;
                break;
            case 'square':
                width = 1024; height = 1024;
                break;
        }
        
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';
        imagePlaceholder.style.display = 'none';
        loadingOverlay.style.display = 'flex';
        
        currentImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random()*1000)}&model=flux&nologo=true`;
        generatedIframe.src = currentImageUrl;
        imageActions.style.display = 'flex';
        
        generatedIframe.onload = function() {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> 生成图像';
            loadingOverlay.style.display = 'none';
        };
    }
});