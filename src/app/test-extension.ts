/// <reference types="forge-viewer" />
//@ts-nocheck

class TestTool extends Autodesk.Viewing.ToolInterface 
{   
    viewer: Autodesk.Viewing.GuiViewer3D;
    names: string[]
    active:boolean;
   
    testToolName = 'test-tool';
    orbitToolName = 'orbit'

    private timerId: number | null = null;
    private readonly holdDuration = 1000;
    private controller:any;

    constructor(viewer: Autodesk.Viewing.GuiViewer3D) {
        super();
        this.viewer = viewer;
        this.names = [this.testToolName];
        this.active = false;
        
        delete this.register;
        delete this.deregister;
        delete this.activate;
        delete this.deactivate;
        delete this.handleButtonDown;
        delete this.handleSingleClick;

        this.controller = this.viewer.toolController;
    }

    register(): void {
        console.log('Hello Test Tool registered.');
    }

    getName(): string {
        return 'test-tool';
    }

    activate(name: string, viewer: Autodesk.Viewing.GuiViewer3D) {
        if(!this.active) {
            this.active = true;
            console.log('Test Tool activated.');
        }
    }

    deactivate(name: string) {
        if(this.active) {
            this.active = false;
            console.log('Test Tool deactivated.');
        }
    }

    getPriority(): number {
        return 1;
    }

    handleButtonDown(event: MouseEvent, button: number): boolean {
        this.controller.activateTool(this.orbitToolName);
        return false;
    }

    handleButtonUp(event: MouseEvent, button: number): boolean {
        return false;
    }


    handleMouseMove(event: MouseEvent): boolean {
        return true;
    }

    handleSingleClick(event: MouseEvent, button: number): boolean {
        if(button === 0){
            console.log(event)
        }
        return true;
    }

}

export class TestExtension extends Autodesk.Viewing.Extension
{

    testToolButton!: Autodesk.Viewing.UI.Button;
    tool: any;

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, options: any)
    {
        super(viewer, options);
        this.tool = new TestTool(this.viewer);
    }

    override load(): boolean {
        this.viewer.toolController.registerTool(this.tool);
        return true;
    }

    override unload(): boolean {
        
        console.log('Test Extension unloaded');
        return true;
    }


    override onToolbarCreated(toolbar: Autodesk.Viewing.UI.ToolBar | undefined): void {

        const controller = this.viewer.toolController;
        
        this.testToolButton = new Autodesk.Viewing.UI.Button('test-tool-button');
        this.testToolButton.icon.classList.add('fas', 'fa-draw-polygon');
        this.testToolButton.setToolTip('Test Tool');
        this.testToolButton.onClick = (ev) => {
            if(this.testToolButton.getState() == Autodesk.Viewing.UI.Button.State.ACTIVE) {
                controller.deactivateTool(this.tool.testToolName);
                this.testToolButton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
                console.log('test tool deactivated')
                console.log(controller.getActiveToolName());
            } else {
                controller.activateTool(this.tool.testToolName);
                this.testToolButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
                console.log('test tool activated')
                console.log(controller.getActiveToolName());
                this.tool.handleSingleClick(ev, 0);
            }
        };

        const controlGroup = new Autodesk.Viewing.UI.ControlGroup('test-toolbar');
        controlGroup.addControl(this.testToolButton);
        toolbar?.addControl(controlGroup);
        
    }

}