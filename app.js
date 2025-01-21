



const renderer = new Renderer('.root');

class CountViewModel extends ViewModel {
    constructor(templateName, componentName) {
        const countModel = new Model([
            {
                propName: 'counter',
                value: 0
            }
        ]);

        const countActions = [
            {
                name: '.increase',
                event: 'click',
                action: (viewModel, e) => {
                    const prop = viewModel.model.getProperty('counter');
                    viewModel.updateProperty('counter', () => prop.value + 1);
                }
            },
            {
                name: '.decrease',
                event: 'click',
                action: (viewModel, e) => {
                    const prop = viewModel.model.getProperty('counter');
                    viewModel.updateProperty('counter', () => prop.value - 1);
                }
            }
        ]

        super(templateName, componentName, countModel, countActions, renderer);
    }
}

class InputViewModel extends ViewModel {
    constructor(templateName, componentName) {
        const inputModel = new Model([
            {
                propName: 'input-value',
                value: 'sdfsd'
            }
        ]);
        
        
        
        const inputActions = [
            {
                name: '.input-value',
                event: 'input',
                action: (viewModel, e) => {
                    viewModel.updateProperty('input-value', () => e.target.value);
                    viewModel.component.querySelector('.output-value').innerHTML = viewModel.model.getProperty('input-value').value;
                }
            }
        ]

        super(templateName, componentName, inputModel, inputActions, renderer);
    }
}

class AppViewModel extends ViewModel {
    constructor(templateName, componentName, model, actions) {
        super(templateName, componentName, model, actions, renderer);
    }
}

const app = new AppViewModel('template.app', 'app', new Model([]), []);

new CountViewModel('template.count-view', 'count-component');
new InputViewModel('template.input-view', 'input-component');