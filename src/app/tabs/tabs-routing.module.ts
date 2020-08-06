import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';



const routes: Routes = [
  {
      path: '',
      component: TabsPage,
      children :[
          {path: 'feed',
          children: [
            {
              path:'',
              loadChildren: () => import('../feed/feed.module').then(m => m.FeedPageModule)
            }
          ]
        },
        {
          path: 'uploader',
          children: [
            {
              path:'',
              loadChildren: () => import('../uploader/uploader.module').then(m => m.UploaderPageModule)
            }
          ]
        },
        {
          path: 'favorites',
          children: [
            {
              path: '',
              loadChildren: () => import('../favorites/favorites.module').then( m => m.FavoritesPageModule)
            }
          ]
        },
      
        {
          path: '',
          redirectTo: 'feed',
          pathMatch: 'full'
        }
      ]
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}