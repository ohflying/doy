import Doy from '../src';

describe('$Scope', () => {
    Doy.why(true);
    let $scope = Doy.$rootScope.$new();
    $scope.store.a = 123;
    test('$Scope changed', () => {
        return new Promise((resolve, reject) => {
            $scope.$on(Doy.$Scope.NEED_RENDER, (event) => {
                console.log('123');
                resolve(event.name);
            });

            $scope.$action(() => {
                $scope.store.a = 321;
            });

        }).then((eventName) => {
            expect(eventName).toEqual(Doy.$Scope.NEED_RENDER);
        });
    });
});
