    // 搜索功能实现
    document.addEventListener('DOMContentLoaded', function() {
        // 模拟商品数据
        const products = [
            { id: 1, name: "无线蓝牙耳机", category: "电子产品", price: 299, image: "https://picsum.photos/id/26/400/400" },
            { id: 2, name: "智能手表", category: "电子产品", price: 499, image: "https://picsum.photos/id/96/400/400" },
            { id: 3, name: "纯棉T恤", category: "服装", price: 89, image: "https://picsum.photos/id/1005/400/400" },
            { id: 4, name: "办公椅", category: "家具", price: 599, image: "https://picsum.photos/id/119/400/400" },
            { id: 5, name: "机械键盘", category: "电子产品", price: 399, image: "https://picsum.photos/id/20/400/400" },
            { id: 6, name: "笔记本电脑", category: "电子产品", price: 4999, image: "https://picsum.photos/id/96/400/400" },
            { id: 7, name: "牛仔裤", category: "服装", price: 199, image: "https://picsum.photos/id/1011/400/400" },
            { id: 8, name: "沙发", category: "家具", price: 2999, image: "https://picsum.photos/id/118/400/400" },
            { id: 9, name: "运动鞋", category: "服装", price: 399, image: "https://picsum.photos/id/1003/400/400" },
            { id: 10, name: "台灯", category: "家具", price: 129, image: "https://picsum.photos/id/128/400/400" }
        ];
        
        // DOM元素
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchSuggestions = document.getElementById('search-suggestions');
        const advancedOptions = document.getElementById('advanced-options');
        const toggleAdvancedBtn = document.getElementById('toggle-advanced');
        const advancedIcon = document.getElementById('advanced-icon');
        const resultCount = document.getElementById('result-count');
        const resultsContainer = document.getElementById('results-container');
        
        // 高级筛选状态
        let isAdvancedOpen = false;
        
        // 初始化
        function init() {
            // 绑定事件
            searchInput.addEventListener('input', handleSearchInput);
            searchInput.addEventListener('focus', handleSearchFocus);
            searchInput.addEventListener('blur', handleSearchBlur);
            searchButton.addEventListener('click', performSearch);
            toggleAdvancedBtn.addEventListener('click', toggleAdvancedOptions);
            
            // 初始化高级筛选为关闭状态
            advancedOptions.classList.add('hidden');
        }
        
        // 处理搜索输入
        function handleSearchInput() {
            const query = searchInput.value.trim().toLowerCase();
            
            if (query.length < 2) {
                hideSuggestions();
                return;
            }
            
            // 生成搜索建议
            const suggestions = generateSuggestions(query);
            displaySuggestions(suggestions);
        }
        
        // 处理搜索框聚焦
        function handleSearchFocus() {
            const query = searchInput.value.trim().toLowerCase();
            
            if (query.length >= 2) {
                const suggestions = generateSuggestions(query);
                displaySuggestions(suggestions);
            }
        }
        
        // 处理搜索框失焦
        function handleSearchBlur() {
            setTimeout(() => {
                hideSuggestions();
            }, 200);
        }
        
        // 生成搜索建议
        function generateSuggestions(query) {
            // 按名称筛选商品
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.category.toLowerCase().includes(query)
            );
            
            // 生成建议
            const suggestions = [];
            
            // 添加热门搜索
            suggestions.push({
                type: 'hot',
                text: `热门搜索: ${query}`,
                query: query
            });
            
            // 添加商品建议
            filteredProducts.slice(0, 5).forEach(product => {
                suggestions.push({
                    type: 'product',
                    text: product.name,
                    query: product.name,
                    price: product.price,
                    image: product.image
                });
            });
            
            // 添加类别建议
            const categories = [...new Set(filteredProducts.map(p => p.category))];
            categories.forEach(category => {
                suggestions.push({
                    type: 'category',
                    text: `所有${category}`,
                    query: category
                });
            });
            
            return suggestions;
        }
        
        // 显示搜索建议
        function displaySuggestions(suggestions) {
            if (suggestions.length === 0) {
                hideSuggestions();
                return;
            }
            
            searchSuggestions.innerHTML = '';
            
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item p-2 hover:bg-gray-100 cursor-pointer flex items-center';
                suggestionItem.setAttribute('data-query', suggestion.query);
                
                if (suggestion.type === 'product') {
                    // 商品建议
                    suggestionItem.innerHTML = `
                        <img src="${suggestion.image}" alt="${suggestion.text}" class="w-10 h-10 object-cover rounded mr-2">
                        <div class="flex-grow">
                            <div class="font-medium">${suggestion.text}</div>
                            <div class="text-sm text-gray-500">¥${suggestion.price}</div>
                        </div>
                        <i class="fa fa-arrow-right text-gray-400"></i>
                    `;
                } else if (suggestion.type === 'category') {
                    // 类别建议
                    suggestionItem.innerHTML = `
                        <i class="fa fa-folder text-gray-400 mr-2"></i>
                        <span>${suggestion.text}</span>
                    `;
                } else {
                    // 热门搜索
                    suggestionItem.innerHTML = `
                        <i class="fa fa-fire text-red-500 mr-2"></i>
                        <span class="font-medium">${suggestion.text}</span>
                    `;
                }
                
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = suggestion.query;
                    performSearch();
                    hideSuggestions();
                });
                
                searchSuggestions.appendChild(suggestionItem);
            });
            
            searchSuggestions.classList.remove('hidden');
        }
        
        // 隐藏搜索建议
        function hideSuggestions() {
            searchSuggestions.classList.add('hidden');
        }
        
        // 切换高级筛选选项
        function toggleAdvancedOptions() {
            isAdvancedOpen = !isAdvancedOpen;
            
            if (isAdvancedOpen) {
                advancedOptions.classList.remove('hidden');
                advancedIcon.classList.add('rotate-180');
            } else {
                advancedOptions.classList.add('hidden');
                advancedIcon.classList.remove('rotate-180');
            }
        }
        
        // 执行搜索
        function performSearch() {
            const query = searchInput.value.trim().toLowerCase();
            
            if (!query) return;
            
            // 获取高级筛选选项
            const category = document.getElementById('category-filter').value;
            const priceRange = document.getElementById('price-filter').value;
            
            // 筛选商品
            const filteredProducts = products.filter(product => {
                // 名称或类别匹配
                const matchesQuery = 
                    product.name.toLowerCase().includes(query) || 
                    product.category.toLowerCase().includes(query);
                
                // 类别筛选
                const matchesCategory = category === 'all' || product.category === category;
                
                // 价格筛选
                const matchesPrice = checkPriceRange(product.price, priceRange);
                
                return matchesQuery && matchesCategory && matchesPrice;
            });
            
            // 显示结果
            displayResults(filteredProducts);
            
            // 滚动到结果区域
            document.getElementById('search-results').scrollIntoView({ behavior: 'smooth' });
        }
        
        // 检查价格是否在范围内
        function checkPriceRange(price, range) {
            if (range === 'all') return true;
            
            const [min, max] = range.split('-').map(Number);
            return price >= min && (isNaN(max) || price <= max);
        }
        
        // 显示搜索结果
        function displayResults(products) {
            resultCount.textContent = `找到 ${products.length} 个商品`;
            
            if (products.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="col-span-full py-10 text-center">
                        <i class="fa fa-search text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">没有找到与 "${searchInput.value}" 相关的商品</p>
                        <button class="mt-4 text-primary hover:underline" onclick="searchInput.value = ''; searchInput.focus()">
                            清除搜索条件
                        </button>
                    </div>
                `;
                return;
            }
            
            resultsContainer.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg';
                productCard.innerHTML = `
                    <div class="relative h-48 overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-800 mb-1">${product.name}</h3>
                        <p class="text-sm text-gray-500 mb-2">${product.category}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-bold text-red-500">¥${product.price}</span>
                            <button class="add-to-cart bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors">
                                加入购物车
                            </button>
                        </div>
                    </div>
                `;
                
                resultsContainer.appendChild(productCard);
            });
        }
        
        // 初始化
        init();
    });
    