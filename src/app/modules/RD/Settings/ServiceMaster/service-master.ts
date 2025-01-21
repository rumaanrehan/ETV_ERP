export interface ServiceMaster {
  ServiceID: number | null;
  ServiceCode: string | null;
  ServiceCategoryID: number | null;
  ServiceName: string | null;
  ServiceRate: number | null;
}
export interface ServiceMasterList {
  RowID: number;
  ServiceID: number;
  ServiceCode: string;
  ServiceCategoryName: number;
  ServiceName: string;
  ActionType: string | null;
  ActiveStatus: any;
}
//public class ServiceMasterValidator : AbstractValidator<ServiceMaster>
//{
//        public ServiceMasterValidator()
//  {
//    RuleFor(x => x.ActionType)
//      .NotEmpty().WithMessage("Action Type is Required.");

//    RuleFor(x => x.ServiceID)
//      .NotEmpty().WithMessage("Service ID is Required.")
//      .When(x => x.ActionType != "Create");

//    RuleFor(x => x.ServiceCategoryID)
//      .NotEmpty().WithMessage("Service Category ID is Required.")
//      .When(x => (x.ActionType == "Create" || x.ActionType == "Update"));

//    RuleFor(x => x.ServiceName)
//      .NotEmpty().WithMessage("Service Name is Required.")
//      .MaximumLength(50).WithMessage("Service Name cannot be longer than 50 characters.")
//      .When(x => (x.ActionType == "Create" || x.ActionType == "Update"));

//    RuleFor(x => x.ServiceRate)
//      .NotEmpty().WithMessage("Service Rate is Required.")
//      .When(x => (x.ActionType == "Create"));

//    RuleFor(x => x.ReasonToUpdate)
//      .NotEmpty().WithMessage("Reason to update is Required.")
//      .When(x => x.ActionType != "Create");
//  }
//}
//}
