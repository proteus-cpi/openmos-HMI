import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ContextMenuModule } from 'ngx-contextmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// angular5, not now // import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// angular5, not now // import { AngularInterceptor } from "./angular/component/angular-interceptor";

// import { AppRoutingModule } from './app-routing.module';

import { KPIService } from './angular/service/kpi.service';
import { SubSystemService } from './angular/service/sub-system.service';
import { ExecutionTableService } from './angular/service/execution-table.service';
import { SkillService } from './angular/service/skill.service';
import { ModuleService } from './angular/service/module.service';
import { ProductService } from './angular/service/product.service';
import { RecipesService } from './angular/service/recipe.service';
import { EquipmentService } from './angular/service/equipment.service';
import { ObservationService } from './angular/service/observation.service';
import { FileUploadService } from './angular/service/file-upload.service';
import { OrderService } from './angular/service/order.service';
import { AssessmentService } from './angular/service/assessment-service';
import { ProcessAssessmentService } from './angular/service/process-assessment-service';
import { OrderInstanceService } from './angular/service/order-instance.service';
import { SystemService } from './angular/service/system.service';
import { RecipeExecutionDataService } from './angular/service/recipe-execution-data.service';
import { T42AdviceService } from './angular/service/t-42-advice.service';
import { RecommendationService } from "./angular/service/recommendation.service";
import { TriggeredService } from "./angular/service/triggered-service";
import { PhysicalAdjustmentService } from "./angular/service/physical-adjustment-service";

import { AppComponent } from './angular/component/app.component';
import { SubSystemListComponent } from './angular/component/sub-system-list.component';
import { KpiComponent } from './angular/component/kpi.module';
import { SubSystemDetailComponent } from './angular/component/sub-system-detail.component';
import { ExecutionTableComponent } from './angular/component/execution-table.component';
import { ExecutionTablePageComponent } from './angular/component/execution-table-page.component';
import { RecipeListComponent } from './angular/component/recipe-list.component';
import { RecipeListPageComponent } from './angular/component/recipe-list-page.component';
import { SkillListComponent } from './angular/component/skill-list.component';
import { SkillListPageComponent } from './angular/component/skill-list-page.component';
import { SkillViewComponent } from './angular/component/skill-view.component';
// import { ModuleDetailPageComponent } from './angular/component/module-detail-page.component';
import { ModuleDetailComponent } from './angular/component/module-detail.component';
import { ModuleListComponent } from './angular/component/module-list.component';
import { ModuleListPageComponent } from './angular/component/module-list-page.component';
import { ProductsListComponent } from './angular/component/products-list.component';
import { ProductViewPageComponent } from './angular/component/product-view-page.component';
import { LeftMenuComponent } from './angular/component/left-menu.component';
import { TopHeaderComponent } from './angular/component/top-header.component';
import { BottomFooterComponent } from './angular/component/bottom-footer.component';
import { ButtonToolbarComponent } from './angular/component/button-toolbar.component';
import { BreadcrumbsComponent } from './angular/component/breadcrumbs.component';
import { SkillRecipeViewComponent } from './angular/component/skill-recipe-view.component';
import { SkillRecipeViewPageComponent } from './angular/component/skill-recipe-view-page.component';
import { SkillViewPageComponent } from './angular/component/skill-view-page.component';
import { AddRecipeSkillPage } from './angular/component/add-recipe-skill-page.component';
import { AddRecipeSkillComponent } from './angular/component/add-recipe-skill.component';
import { AddEquipmentObservationComponent } from './angular/component/add-equipment-observation.component';
import { AddEquipmentObservationPageComponent } from './angular/component/add-equipment-observation-page.component';
import { NotFoundComponent } from './angular/component/not-found-page.component';
import { AddNewProductPageComponent } from './angular/component/add-new-product-page.component';
import { ObjectPrettyPritterComponent } from './angular/component/object-pretty-printer.component';
import { AddNewOrderPageComponent } from './angular/component/add-new-order-page.component';
import { AcceptConditionComponent } from './angular/component/accept-condition.component';
import { AddNewProductComponent } from './angular/component/add-new-product.component';
import { AddEquipmentAssessmentPageComponent } from './angular/component/add-equipment-assessment-page.component';
import { AddProcessAssessmentPageComponent } from './angular/component/add-process-assessment-page.component';
import { OrderInstanceListPageComponent } from './angular/component/order-instance-list-page.component';
import { OrderInstanceViewPageComponent  } from './angular/component/order-instance-view-page.component';
import { RecipeExecutionDataGraphComponent } from './angular/component/recipe-execution-graph.component';
import { SharedDataService } from './angular/service/shared.data.service';
import { CookieService } from 'ngx-cookie-service';
import { PhysicalParamsListComponent } from './angular/component/physical-params-list.component';
import { RecipesPerProductInstanceComponent } from "./angular/component/recipes-per-product-instance";
import { KpisForProductAndRecipeComponent } from "./angular/component/kpis-for-product-and-recipe";
import { RecommendationsListComponent } from "./angular/component/recommendations-list.component";
import { TriggeredSkillsListPageComponent } from "./angular/component/triggered-skills-list-page.component";
import { TriggeredRecipesListPageComponent } from "./angular/component/triggered-recipes-list-page.component";
import { EquipmentAssessmentsListComponent } from "./angular/component/equipment-assessments-list.component";
import { EquipmentAssessmentDetailPageComponent } from "./angular/component/equipment-assessment-detail-page.component";
import { ProcessAssessmentsListComponent } from "./angular/component/process-assessments-list.component";
import { PhysicalAdjustmentsListComponent } from "./angular/component/physical-adjustments-list.component";
import { EquipmentObservationsListComponent } from "./angular/component/equipment-observations-list.component";

@NgModule({
  declarations: [
    AppComponent,
    SubSystemListComponent,
    KpiComponent,
    SubSystemDetailComponent,
    ExecutionTableComponent,
    ExecutionTablePageComponent,
    RecipeListComponent,
    RecipeListPageComponent,
    SkillListComponent,
    SkillListPageComponent,
    ModuleListComponent,
    ModuleListPageComponent,
    // ModuleDetailPageComponent,
    ModuleDetailComponent,
    SkillViewComponent,
    ProductsListComponent,
    ProductViewPageComponent,
    LeftMenuComponent,
    TopHeaderComponent,
    BottomFooterComponent,
    ButtonToolbarComponent,
    BreadcrumbsComponent,
    SkillRecipeViewComponent,
    SkillRecipeViewPageComponent,
    SkillViewPageComponent,
    AddRecipeSkillPage,
    AddRecipeSkillComponent,
    AddEquipmentObservationComponent,
    AddEquipmentObservationPageComponent,
    NotFoundComponent,
    AddNewProductPageComponent,
    AddNewOrderPageComponent,
    ObjectPrettyPritterComponent,
    AcceptConditionComponent,
    AddNewProductComponent,
    AddEquipmentAssessmentPageComponent,
    AddProcessAssessmentPageComponent,
    OrderInstanceListPageComponent,
    OrderInstanceViewPageComponent,
    RecipeExecutionDataGraphComponent,
    PhysicalParamsListComponent,
    RecipesPerProductInstanceComponent,
    KpisForProductAndRecipeComponent,
    RecommendationsListComponent,
    TriggeredSkillsListPageComponent,
    TriggeredRecipesListPageComponent,
    EquipmentAssessmentsListComponent,
    EquipmentAssessmentDetailPageComponent,
    ProcessAssessmentsListComponent,
    PhysicalAdjustmentsListComponent,
    EquipmentObservationsListComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    
    // angular5, not now // HttpClientModule,

    ContextMenuModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    RouterModule.forRoot([
        {path: '', redirectTo: '/subSystems', pathMatch: 'full'},
        {path: 'subSystems', component: SubSystemListComponent },
        {path: 'orderInstances', component: OrderInstanceListPageComponent },
        {path: 'orderInstance/:id', component: OrderInstanceViewPageComponent },
        {path: 'kpi', component: KpiComponent},
        // {path: 'subSystems/:id', component: SubSystemDetailComponent},
        // {path: 'subSystem/:subSystemId', component: SubSystemDetailComponent},
        {path: 'subSystem/:parentId', component: SubSystemDetailComponent},
        // {path: 'executionTable/:executionTableId/:parentType/:parentId', component: ExecutionTablePageComponent},
        {path: 'executionTable/:parentType/:parentId', component: ExecutionTablePageComponent},
        {path: 'skillRecipes/:parentType/:parentId', component: RecipeListPageComponent},
        {path: 'nonActiveRecipes/:parentType/:parentId', component: RecipeListPageComponent},
        {path: 'skills/:parentType/:parentId', component: SkillListPageComponent},
        {path: 'module/:moduleId', component: ModuleDetailComponent},
        {path: 'modules/:parentType/:parentId', component: ModuleListPageComponent},
        {path: 'products', component: ProductsListComponent },
        // {path: 'product/:parentType/:parentId', component: ProductViewPageComponent },
        {path: 'productDetail/:parentId', component: ProductViewPageComponent },
        {path: 'leftMenu', component: LeftMenuComponent },
        {path: 'topHeader', component: TopHeaderComponent },
        {path: 'bottomFooter', component: BottomFooterComponent },
        {path: 'buttonToolbar', component: ButtonToolbarComponent },
        {path: 'breadcrumbs', component: BreadcrumbsComponent },
        {path: 'skillRecipeView/:parentType/:parentId', component: SkillRecipeViewPageComponent },
        {path: 'skillDetail/:parentType/:parentId', component: SkillViewPageComponent},
        {path: 'addRecipeSkill/:parentType/:parentId', component: AddRecipeSkillPage},
        {path: 'addEquipmentObservation/:parentType/:parentId', component: AddEquipmentObservationPageComponent },
        {path: '404', component: NotFoundComponent},
        {path: 'addNewProduct', component: AddNewProductPageComponent},
        {path: 'addNewOrder', component: AddNewOrderPageComponent },
        {path: 'addEquipmentAssessment/:parentType/:parentId', component: AddEquipmentAssessmentPageComponent},
        {path: 'addProcessAssessment/:parentType/:parentId', component: AddProcessAssessmentPageComponent},
        {path: 'executionDataGraph/:recipeId', component: RecipeExecutionDataGraphComponent},
        {path: 'executionDataGraph/:functionName/:productInstanceId/:recipeId', component: RecipeExecutionDataGraphComponent},
        {path: 'recipesPerProductInstance/:productInstanceId', component: RecipesPerProductInstanceComponent},
        {path: 'recipesPerProductInstance/:productInstanceId/:startDate/:endDate', component: RecipesPerProductInstanceComponent},
        {path: 'kpisForProductAndRecipe/:productInstanceId/:recipeId', component: KpisForProductAndRecipeComponent},
        {path: 'kpisForProductAndRecipe/:productInstanceId/:recipeId/:recipeName', component: KpisForProductAndRecipeComponent},
        {path: 'recommendations', component: RecommendationsListComponent },
        {path: 'triggeredSkills/:skillId', component: TriggeredSkillsListPageComponent},
        {path: 'triggeredRecipes/:recipeId', component: TriggeredRecipesListPageComponent},
        {path: 'equipmentAssessments', component: EquipmentAssessmentsListComponent},
        {path: 'equipmentAssessments/:openmosTarget', component: EquipmentAssessmentsListComponent},
        {path: 'equipmentAssessments/:openmosContext/:openmosTarget', component: EquipmentAssessmentsListComponent},
        {path: 'processAssessments', component: ProcessAssessmentsListComponent},
        {path: 'processAssessments/:openmosContext/:openmosTarget', component: ProcessAssessmentsListComponent},
        {path: 'physicalAdjustments', component: PhysicalAdjustmentsListComponent},
        {path: 'physicalAdjustments/:openmosContext/:openmosTarget', component: PhysicalAdjustmentsListComponent},
        {path: 'equipmentObservations', component: EquipmentObservationsListComponent},
        {path: 'equipmentObservations/:openmosTarget', component: EquipmentObservationsListComponent},
        {path: 'equipmentObservations/:openmosContext/:openmosTarget', component: EquipmentObservationsListComponent},
        {path: '**', redirectTo: '/404'}    // MUST BE THE LAST LINE OF THIS LIST
      ]
    )
  ],
  exports: [RouterModule],
  providers: [KPIService,
    SubSystemService,
    ExecutionTableService,
    SkillService,
    ModuleService,
    ProductService,
    RecipesService,
    EquipmentService,
    ObservationService,
    FileUploadService,
    OrderService,
    AssessmentService,
    OrderInstanceService,
    OrderInstanceService,
    SystemService,
    ProcessAssessmentService,
    OrderInstanceService,
    RecipeExecutionDataService,
    SharedDataService,
    CookieService,
    T42AdviceService,
    RecommendationService,
    TriggeredService,
    PhysicalAdjustmentService
    // angular5, not now //   { provide: HTTP_INTERCEPTORS, useClass: AngularInterceptor, multi: true }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
