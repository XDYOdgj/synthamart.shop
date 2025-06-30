
import httpRequest from '../common/http.js';
import fit from '../common/fit.js';

let from = {
    page: 1,
    limit: 8,
    category: null
}
let totalCount = 0;

$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    from.category = urlParams.get('category');
    from.page = 1;
    getBlogList()
});

// 文章列表
const getBlogList = () => {
    $("#blog-grid").html(
        `<div style="font-size: 30px; text-align: center; width: 100%; color: #cf9163; margin: 20px 0; padding: 10px 0; background: linear-gradient(90deg, #f4e2d8, #f8f4e5); border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            loading...
        </div>`
    );

    // 构建请求参数
    const params = {
        page: from.page,
        limit: from.limit
    };

    if (from.category) {
        params.category = from.category;
    }

    // 调用API获取博客数据
    httpRequest('/blog_posts/index', 'GET', params)
        .then(response => {
            if (response.code === 1) {
                const data = response.data;
                let html = "";

                if (data.list && data.list.length > 0) {
                    data.list.forEach(item => {
                        html += `
                            <article class="post-item post-grid col-bg-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-ts-12">
                                <div class="post-inner">
                                    <div class="post-content">
                                        <h2 class="post-title">
                                            <a href="blog-detail.html?id=${item.id}">${item.title}</a>
                                        </h2>
                                        <div class="post-meta">
                                            <span class="post-author">${item.author} &nbsp;</span>
                                            <span class="post-date">${item.date}</span>
                                            ${item.domain ? `<span class="post-domain"> - ${item.domain}</span>` : ''}
                                        </div>
                                        <div class="post-info equal-elem">
                                            ${item.content}
                                        </div>
                                    </div>
                                </div>
                            </article>`;
                    });

                    $("#blog-grid").html(html);

                    // 更新分页
                    totalCount = data.total;
                    if (totalCount && Math.ceil(totalCount / from.limit) > 1) {
                        $("#pagination").html(createPagination(from.page, Math.ceil(totalCount / from.limit)));
                    } else {
                        $("#pagination").html("");
                    }
                } else {
                    $("#blog-grid").html(
                        `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">Network error. Please try again later</div>`
                    );
                    $("#pagination").html("");
                }
            } else {
                $("#blog-grid").html(
                    `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">fail to load: ${response.msg || '未知错误'}</div>`
                );
            }
        })
        .catch(error => {
            console.error('获取博客列表失败:', error);
            $("#blog-grid").html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">Network error. Please try again later</div>`
            );
        });

        // 图片已移除，不再需要适配高度
}

// 分页函数 (与shop-list.js相同)
const createPagination = (currentPage, totalPages) => {
    let paginationHtml = "";
    if (currentPage > 1) {
        paginationHtml += "<li class='pagination-li'>&lt;</li>";
    }
    paginationHtml += generatePageNumberHtml(1, currentPage);
    if (totalPages > 1) {
        if (currentPage > 3) {
            paginationHtml += "<li class='pagination-li'>...</li>";
        }
        for (
            let i = Math.max(currentPage - 2, 2); i <= Math.min(currentPage + 2, totalPages - 1); i++
        ) {
            paginationHtml += generatePageNumberHtml(i, currentPage);
        }
        if (currentPage < totalPages - 2) {
            paginationHtml += "<li class='pagination-li'>...</li>";
        }
    }
    paginationHtml += generatePageNumberHtml(totalPages, currentPage);
    if (currentPage < totalPages) {
        paginationHtml += "<li class='pagination-li'>&gt;</li>";
    }
    return paginationHtml;
}

const generatePageNumberHtml = (pageNumber, currentPage) => {
    return (
        '<li class="pagination-li ' +
        (pageNumber === currentPage ? "pagination-active" : "") +
        '">' +
        pageNumber +
        "</li>"
    );
}

const selectPage = (pageNumber) => {
    from.page
 = pageNumber;
    getBlogList()
}

// 分页点击事件
$("#pagination").on("click", "li", function (event) {
    let pageNumber = $(this).text();
    if (pageNumber === "...") {
        event.preventDefault();
        return;
    }

    $('html, body').animate({
        scrollTop: 350
    }, 500);

    var currentPage = from.page;
    if (pageNumber === "<") {
        selectPage(currentPage - 1
);
    } else if (pageNumber === ">") {
        selectPage(currentPage + 1);
    } else {
        selectPage(parseInt(pageNumber));
    }
});
