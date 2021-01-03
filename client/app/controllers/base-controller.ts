export abstract class BaseController {
    protected constructor(protected readonly id) {
    }

    protected abstract initView();
}