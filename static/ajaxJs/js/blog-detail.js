import httpRequest from '../common/http.js';
import fit from '../common/fit.js';

$(document).ready(function () {
    // 获取URL参数中的文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        $('#blog-detail').html(
            `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">文章ID参数缺失</div>`
        );
        return;
    }

    getBlogDetail(articleId);
});

// 获取文章详情
const getBlogDetail = (id) => {
    $('#blog-detail').html(
        `<div style="font-size: 30px; text-align: center; width: 100%; color: #cf9163; margin: 20px 0; padding: 10px 0; background: linear-gradient(90deg, #f4e2d8, #f8f4e5); border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            loading...
        </div>`
    );

    // 调用API获取文章详情
    httpRequest('/blog_posts/detail', 'GET', { id: id })
        .then(response => {
            if (response.code === 1) {
                const article = response.data;

                const html = `
                        
                <div class="single-post-info">
                    <h2 class="post-title"><a href="#">${article.title}</a></h2>
                    <div class="post-meta">
                        <div class="date">
                            <a href="#">${article.date} </a>
                        </div>
                        <div class="post-author">
                            By:<a href="#"> ${article.author} </a>
                        </div>
                    </div>
                </div>
                        
                        <div class="post-content">
                            ${article.content}
                        </div>
                        
                        <footer class="post-footer">
                            <div class="post-actions">
                                <a href="blog-grid" class="btn btn-primary">back</a>
                            </div>
                        </footer>
                    </article>
                `;

                $('#blog-detail').html(html);

                // 更新页面标题
                document.title = article.title + ' - Blog Detail';

            } else {
                $('#blog-detail').html(
                    `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">加载失败: ${response.msg || '未知错误'}</div>`
                );
            }
        })
        .catch(error => {
            console.error('获取文章详情失败:', error);
            $('#blog-detail').html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">网络错误，请稍后重试</div>`
            );
        });
};
