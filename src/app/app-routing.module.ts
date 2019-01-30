import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CPADListComponent } from './angular/component/cpad-list.component';
import { KpiComponent } from './angular/component/kpi.module';
import { CPADDetailComponent } from './angular/component/cpad-detail.component';
import { ExecutionTableComponent } from './angular/component/execution-table.component';
import { RecipeListComponent } from './angular/component/recipe-list.component';
import { SkillListComponent } from './angular/component/skill-list.component';
import { SkillViewComponent } from './angular/component/skill-view.component';

const routes: Routes = [
        {path: '', redirectTo: '/workstations', pathMatch: 'full'},
        {path: 'workstations', component: CPADListComponent },
        {path: 'kpi', component: KpiComponent},
        {path: 'cpdDetail/:id', component: CPADDetailComponent},
        {path: 'executionTable/:id', component: ExecutionTableComponent},
        {path: 'recipeList/:id', component: RecipeListComponent},
        {path: 'skillList/:id', component: SkillListComponent},
        {path: 'skillDetails/:id', component: SkillViewComponent}
      ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }