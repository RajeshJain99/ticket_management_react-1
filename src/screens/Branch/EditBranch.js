import { ready } from "jquery";
import React from "react";
import { userContext } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { fetchContext } from "../../context/FetchContext";
import { useHistory, useParams } from "react-router-dom";
import { url } from "src/helpers/Helpers";
import validator from "validator";
import Select from "react-select";
import Loader from 'src/components/Loader'

export default function CreateBranch() {
  const { id } = useParams();
  const [branchName, setBranchName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [countryId, setCountryId] = React.useState("");
  const [stateId, setStateId] = React.useState("");
  const [cityId, setCityId] = React.useState("");
  const [matchStates, setMatchStates] = React.useState([]);
  const [matchCities, setMatchCities] = React.useState([]);
  const [company, setCompany] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [mobileno, setMobileno] = React.useState("");
  const [companyid, setCompanyId] = React.useState("");
  const [originalEmail, setOriginalEmail] = React.useState("");
  const[loader,SetLoader] = React.useState(false);
  const { user } = React.useContext(userContext);
  const history = useHistory();

  const { allCountries, getStates, getCities } = React.useContext(fetchContext);

  const setStatefunc = (value) => {
    setStateId(value);
    setMatchCities(getCities(value.value));
  };

  const setcountryfunc = (value) => {
    setCountryId(value);
    setMatchStates(getStates(value.value));
    setStateId("");
    setCityId("");
    setMatchCities([]);
  };

  React.useEffect(() => {
    async function getComapny() {
      SetLoader(true);
      const response = await fetch(url + "fetchCompaniesRoleBranch/", {
        headers: {
          Authorization: user.token,
        },
      });
      if (response.ok == true) {
        const data = await response.json();

        if (data.status == 200) {
          let company = data.companies_data;
          setCompany(
            company.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })
          );
          SetLoader(false);
        } else if (data.status == 404) {
          return (window.location = window.location.origin + "/#/404");
        } else {
          toast.error(data.message);
          SetLoader(false);
        }
      }
    }

    async function FetchBranchData() {
      SetLoader(true);
      const response = await fetch(url + "edit/branch/" + id, {
        headers: {
          Authorization: user.token,
        },
      });

      if (response.ok == true) {
        const data = await response.json();

        if (data.status == 200) {
          let BranchData = data.branch_data;
          setBranchName(BranchData.name);
          setAddress(BranchData.address);
          setMobileno(BranchData.mobile);
          setEmail(BranchData.email);
          setOriginalEmail(BranchData.email);
          setCountryId({
            value: BranchData.country_id,
            label: BranchData.country_name,
          });
          setcountryfunc({
            value: BranchData.country_id,
            label: BranchData.country_name,
          });
          setStateId({
            value: BranchData.state_id,
            label: BranchData.state_name,
          });
          setStatefunc({
            value: BranchData.state_id,
            label: BranchData.state_name,
          });
          setCityId({
            value: BranchData.city_id,
            label: BranchData.city_name,
          });
          setCompanyId({
            value: BranchData.company_id,
            label: BranchData.company_name,
          });
          SetLoader(false);
        } else if (data.status == 401) {
          toast.error(
            "Unable to fetch the data please reload the page or try again later"
          );
        } else {
          toast.error(data.error);
          SetLoader(false);
        }
      }
    }
    getComapny();
    FetchBranchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (countryId && stateId && cityId) {
      if (validator.isMobilePhone(mobileno)) {
        SetLoader(true);
        async function submitBranch() {
          const formdata = new FormData();
          formdata.append("branch_id", id);
          formdata.append("name", branchName);
          formdata.append("address", address);
          formdata.append("country_id", countryId.value);
          formdata.append("state_id", stateId.value);
          formdata.append("city_id", cityId.value);
          if (user?.userData.role_id == 1) {
            formdata.append("company_id", companyid.value);
          } else {
            formdata.append("company_id", user?.userData.company_id);
          }
          formdata.append("orignal_email", originalEmail);
          formdata.append("email", email);
          formdata.append("mobile", mobileno);
          const response = await fetch(url + "updateBranch/", {
            method: "POST",
            headers: {
              Authorization: user.token,
            },
            body: formdata,
          });
          if (response.ok == true) {
            const data = await response.json();
            if (data.status == 200) {
              return history.push("/branchList/");
            } else if (data.status == 404) {
              return (window.location = window.location.origin + "/#/404");
            } else {
              setEmail(data?.condition);
              toast.error(data.message);
              SetLoader(false);
            }
          }
        }
        submitBranch();
      } else {
        toast.error("Invaild Phone Number");
      }
    } else {
      toast.error("Select Dropdown Values First");
    }
  };

  return (
    <section>
      {loader && <Loader/>}
      <ToastContainer />
      <div className="container">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="">Branch Name</label>
                <input
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="">Email</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="">Mobile no</label>
                <input
                  required
                  value={mobileno}
                  onChange={(e) => setMobileno(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="">Country</label>
              <Select
                options={allCountries}
                value={countryId}
                onChange={setcountryfunc}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="">State</label>
              <Select
                options={matchStates}
                value={stateId}
                onChange={setStatefunc}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="">City</label>
              <Select
                options={matchCities}
                value={cityId}
                onChange={setCityId}
              />
            </div>
          </div>
          <br />
          {user?.userData.role_id == 1 && (
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="">Select Company</label>
                  <Select
                    options={company}
                    value={companyid}
                    onChange={setCompanyId}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-12 mt-4">
              <label htmlFor="">Address</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                cols="137"
                rows="10"
              ></textarea>
            </div>
          </div>

          <div className="row mt-4 big-btn-div">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
