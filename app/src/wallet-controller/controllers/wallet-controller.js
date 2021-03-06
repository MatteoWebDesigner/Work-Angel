'use strict';

angular
	.module('Wallet')
	.controller('WalletCtrl', ['$log', '$scope', '$rootScope', 'Config', 'PersistentDataMoneyFactory', function ($log, $scope, $rootScope, Config, PersistentDataMoneyFactory) {
		$scope.Config = Config;

		// restore data
		PersistentDataMoneyFactory.RestoreState();

		$scope.moneyInfo = PersistentDataMoneyFactory;
		
		$scope.addMoney = function (value) {
			$log.debug('add this amount ' + value + ' in my wallet');

			$scope.moneyInfo.model.Balance += value;
			
			$scope.$broadcast('transitionMoneyIn', function () { 
					return {
						amout : value,
						currency: Config.activeCurrency,
						date : Date.now()
					}
				}
			);
			
			PersistentDataMoneyFactory.SaveState();
		}

		$scope.removeMoney = function (value) {
			if ($scope.moneyInfo.model.Balance < value) {
				$log.debug('this amount ' + value + ' is greater than the balance ' + $scope.moneyInfo.model.Balance);

				alert('You have not enough money');
				return false;
			}
			$log.debug('remove this amount ' + value + ' in my wallet');

			$scope.moneyInfo.model.Balance -= value;

			$scope.$broadcast('transitionMoneyOut', function () { 
					return {
						amout : value,
						currency: Config.activeCurrency,
						date : Date.now()
					}
				}
			);

			PersistentDataMoneyFactory.SaveState();
		}

		$scope.clearData = function () {};
	}]);