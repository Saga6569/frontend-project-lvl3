export default class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.innerHTML = `<main class="flex-grow-1">
    <section class="container-fluid bg-dark p-5">
      <div class="row">
        <div class="col-md-10 col-lg-8 mx-auto text-white">
          <h1 class="display-3 mb-0">RSS агрегатор</h1>
          <p class="lead">Начните читать RSS сегодня! Это легко, это красиво.</p>
            <form action="" class="rss-form text-body">
              <div class="row">
                <div class="col">
                  <div class="form-floating">
                    <input id="url-input" autofocus="" required="" name="url" aria-label="url" class="form-control w-100" placeholder="ссылка RSS"> 
                    <label for="url-input">Ссылка RSS</label>
                  </div>
                </div>
                <div class="col-auto">
                  <button type="submit" aria-label="add" class="h-100 btn btn-lg btn-primary px-sm-5">Добавить</button>
                </div>
              </div>
            </form>
            <p class="mt-2 mb-0 text-muted">Пример: https://ru.hexlet.io/lessons.rss</p>
            <p class="feedback m-0 position-absolute small text-danger"></p>
        </div>
      </div>
    </section>
        <section class="container-fluid container-xxl p-5">
          <div class="row">
          <div class="col-md-10 col-lg-8 order-1 mx-auto posts"></div>
          <div class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds"></div></div>
          </div>
        </section>
  </main>`;
  }
}