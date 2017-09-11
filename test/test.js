/* @flow */

import $Scope, { $rootScope } from '../src/core/$Scope';

let $scope = $rootScope.$new({
    author: {
        name: 'John'
    },
    message: []
});

$scope.$action(() => {
    console.log('author.name=' + $scope.store.author.name);
});

$scope.$on($Scope.NEED_RENDER, () => {
    console.log('Need Render!');
});

$scope.store.author.name = 'Ely';
